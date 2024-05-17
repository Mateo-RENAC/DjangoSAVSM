git config --global url."https://github.com/".insteadOf git://github.com/
virtualenv venv
.venv/bin/pip install -r requirments.txt
sh scripts/makemigrations.sh
sh scripts/run.sh