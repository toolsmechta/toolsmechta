#!/usr/bin/sh

$shell="shell-fetch_counter"

if [[ ! -e "./$shell" ]] then;
    if [[ command -e cmake ]] && [[ command -e g++ ]] then
        echo "compiller is not installed"
        exit 1
    fi
fi
