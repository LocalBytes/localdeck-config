#!/usr/bin/env python3
import os
import subprocess
import time
from datetime import datetime

FLASHLOGS_DIR = './flashlogs'


def esptool_read_mac():
    try:
        # Run esptool to get the MAC address
        mac_address = subprocess.check_output(
            ['esptool', 'read_mac'], stderr=subprocess.STDOUT).decode('utf-8')

        # Extract the MAC address from the output
        mac_address = next(
            (line for line in mac_address.splitlines() if 'MAC:' in line), None)
        return mac_address[5:]
    except subprocess.CalledProcessError:
        return None


def writePrint(output, text: str):
    print(text, end='')
    output.write(text)


def esptool_flash(output):
    with open(output, 'a+') as log_file:
        log_file.write(f"---- {datetime.now()} ----\n")
        log_file.write("Flashing LocalDeck\n")
        log_file.write(f"Serial number: {sn}\n")
        log_file.write(f"MAC address:  {mac}\n")
        log_file.write("----\n")
        while True:

            # Run esptool to flash the ESP32
            process = subprocess.Popen(
                ['esptool', 'write_flash', '0x0',
                    './../.esphome/build/localdeck/.pioenvs/localdeck/firmware.factory.bin'],
                stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
            )
            for line in process.stdout:
                writePrint(log_file,line)

            code = process.wait()
            if code == 0:
                break
            else:
                writePrint(log_file, f"Error code: {code}\n")
                writePrint(log_file, f"Retrying...\n")
                time.sleep(1)


def mac_safe(mac_address: str) -> str:
    return ''.join(filter(str.isalnum, mac_address)).lower()


def get_next_sn(mac_address: str) -> int:
    # Check if the mac address is already in the log directory
    safe_mac = mac_safe(mac_address)

    dir_list = os.listdir(FLASHLOGS_DIR)
    for file in dir_list:
        if safe_mac in file:
            sn = int(file.split('-')[0])
            print("Found existing log file for this device. ")
            print(f"Serial number: {sn}, MAC address: {mac_address}")

            isSure = input("Reflash device: [Y/n] ")
            if (isSure.lower() == 'n'):
                return -1

            return sn

    # If the MAC address is not in the log directory, find the next available serial number
    return max([int(file.split('-')[0]) for file in dir_list], default=0) + 1


# Create dir if not exits
if not os.path.exists(FLASHLOGS_DIR):
    os.makedirs(FLASHLOGS_DIR)

# Wrap this in a loop to keep it running forever (until keyboard interrupt)
while True:
    print(f"\033]0;Flasher\007")
    print("Finding next device...")

    mac = None
    # Run esptool_read_mac until we have a valid MAC address
    while not mac:
        mac = esptool_read_mac()

    # Run get_next_sn_safe with the MAC address
    sn = get_next_sn(mac)

    if (sn == -1):
        print("Skipping device...")
        continue

    # Construct the new filename for the log file
    filename = f"{FLASHLOGS_DIR}/{sn:04}-{mac_safe(mac)}.log"

    # Set the terminal title to the device being flashed
    print(f"\033]0;Flash - {sn:04} - {mac}\007")

    print("---- Flashing device ----")
    print(f"Serial number: {sn:04}")
    print(f"MAC address: {mac}")

    esptool_flash(filename)
    print(f"Device {sn:04} flashed successfully!")
    print(f"Log saved to {filename}")
    input("Press Enter to continue...")

    #clear the terminal title
    time.sleep(1)
