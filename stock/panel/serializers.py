# panel/serializers.py
from rest_framework import serializers
from .models import Product, Stock, StockHistory, Consumption, ConsoHistory, Alert, Batch, Order, Shortcut


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = '__all__'


class StockHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = StockHistory
        fields = '__all__'


class ConsumptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consumption
        fields = '__all__'


class ConsoHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsoHistory
        fields = '__all__'


class AlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = '__all__'


class BatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Batch
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'


class ShortcutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shortcut
        fields = '__all__'


class TableSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)


class ColumnSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    data_type = serializers.CharField(max_length=255)


class RowSerializer(serializers.Serializer):
    data = serializers.DictField()


class ColumnDataSerializer(serializers.Serializer):
    # Define your column fields here with validation rules
    field_name = serializers.CharField(max_length=100)
    min_value = serializers.IntegerField()
    max_value = serializers.IntegerField()
    format = serializers.RegexField(regex=r'^[a-zA-Z0-9]+$')


def create_dynamic_serializer(_model, _fields=None):
    class DynamicFieldsModelSerializer(serializers.ModelSerializer):
        class Meta:
            model = _model
            fields = _fields if _fields else [field.name for field in model._meta.fields]

    return DynamicFieldsModelSerializer
