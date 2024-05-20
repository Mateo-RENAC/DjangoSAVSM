# forms.py
from django import forms
from .models import Product

class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ['name', 'reference', 'user_name', 'abbreviated_user_name', 'description', 'order_link']
