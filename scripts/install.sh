git config --global url."https://github.com/".insteadOf git://github.com/
virtualenv venv
.venv/bin/pip install -r requirments.txt
cd stock
../.venv/bin/python manage.py makemigrations
../.venv/bin/python manage.py migrate
../.venv/bin/python manage.py runserver