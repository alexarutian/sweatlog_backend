# Generated by Django 4.0.1 on 2022-03-18 20:19

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0004_alter_blockexercise_unique_together_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blockexercise',
            name='stat',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='blockexercises', to='webapp.stat'),
        ),
    ]