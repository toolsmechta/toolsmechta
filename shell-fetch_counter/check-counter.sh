#!/usr/bin/sh

shell="shell-fetch_counter"

if [[ ! -f "$(pwd)/${shell}" ]]; then
    if [[ ! -f $(command -v cmake) ]] || [[ ! -f $(command -v g++) ]]; then
        echo "compiller is not installed"
        exit 1
    fi
    tmp_dir="/tmp/${shell}_tmp/"
    cmake -S "./${shell}-sources" -B ${tmp_dir} -DCMAKE_BUILD_TYPE=Release
    cmake --build "${tmp_dir}" -j $(nproc)
    cp -v ${tmp_dir}/$shell ./
    rm -rf ${tmp_dir}
    echo "compilling complete"
fi

chmod +x ./$shell
"./$shell"
