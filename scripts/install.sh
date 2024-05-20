git config --global url."https://github.com/".insteadOf git://github.com/
python3.8 -m venv ".venv"
.venv/bin/pip install -r requirments.txt
sh scripts/makemigrations.sh
sh scripts/run.sh