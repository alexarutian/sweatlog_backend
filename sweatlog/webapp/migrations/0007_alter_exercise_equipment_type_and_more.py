# Generated by Django 4.0.1 on 2022-05-10 03:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0006_alter_workoutblock_block_quantity'),
    ]

    operations = [
        migrations.AlterField(
            model_name='exercise',
            name='equipment_type',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='exercises', to='webapp.equipmenttype'),
        ),
        migrations.AlterField(
            model_name='exercise',
            name='exercise_type',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='exercises', to='webapp.exercisetype'),
        ),
    ]