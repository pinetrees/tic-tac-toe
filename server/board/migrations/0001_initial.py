# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import tic_tac_toe.fields


class Migration(migrations.Migration):

    dependencies = [
        ('players', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='Board',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('is_complete', models.BooleanField(default=False)),
                ('current_player', models.ForeignKey(related_name='board_currents', to='players.Player', null=True)),
                ('player_one', models.ForeignKey(related_name='board_firsts', to='players.Player', null=True)),
                ('player_two', models.ForeignKey(related_name='board_seconds', to='players.Player', null=True)),
            ],
        ),
        migrations.CreateModel(
            name='BoardTemplate',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('board_hash', models.CharField(max_length=18, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Cell',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('row', models.IntegerField(default=0)),
                ('col', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='CellState',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('state', tic_tac_toe.fields.IntegerRangeField()),
                ('game_index', tic_tac_toe.fields.IntegerRangeField(null=True)),
                ('board', models.ForeignKey(related_name='cells', to='board.Board', null=True)),
                ('cell', models.ForeignKey(to='board.Cell', null=True)),
                ('player', models.ForeignKey(to='players.Player', null=True)),
            ],
        ),
        migrations.AddField(
            model_name='board',
            name='template',
            field=models.ForeignKey(to='board.BoardTemplate', null=True),
        ),
    ]
