git config --global url."https://github.com/".insteadOf git://github.com/
python -m venv .venv
.venv\Scripts\pip install -r requirments.txt
call scripts/makemigrations.bat
call scripts/run.bat