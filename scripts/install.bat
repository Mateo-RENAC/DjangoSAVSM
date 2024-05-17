git config --global url."https://github.com/".insteadOf git://github.com/
python -m venv .venv
.venv\Scripts\pip install -r requirments.txt
.venv\Scripts\python manage.py makemigrations
.venv\Scripts\python manage.py migrate
.venv\Scripts\python manage.py runserver