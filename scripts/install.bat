git config --global url."https://github.com/".insteadOf git://github.com/
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt
call scripts/makemigrations.bat
echo Backend install complete !