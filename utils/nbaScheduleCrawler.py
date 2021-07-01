from nba_api.stats.static import teams
from nba_api.stats.endpoints import leaguegamefinder, teamgamelog, scoreboardv2
from nba_api.stats.library.parameters import GameDate

import pymongo
import argparse
import env
import os
import pandas as pd
import datetime
import pickle
from time import sleep

parser = argparse.ArgumentParser()
parser.add_argument('--start', type=int,
                    help='')
parser.add_argument('--end', type=int,
                    help='')
args = parser.parse_args()

teams = teams.get_teams()
id2team = {}
season_type = {'1': 'preseason', '2': 'regular', '4': 'playoff'}

data_dir = 'data'

for team in teams:
    id2team[team['id']] = team

games_dict = {}
today = datetime.datetime.today()

client = pymongo.MongoClient(env.MONGO_URL)
db = client['WP-Project']
schedule_collection =  db['schedule']

for d in range(args.start, args.end):
    date = today + datetime.timedelta(days=d)
     
    flag1 = False
    flag2 = False
    # if os.path.exists(f'{data_dir}/{date.strftime("%Y-%m-%d")}.csv'):
    #     games = pd.read_csv(f'{data_dir}/{date.strftime("%Y-%m-%d")}.csv')
    #     flag1 = True
    # if os.path.exists(f'{data_dir}/{date.strftime("%Y-%m-%d")}_abbr.csv'):
    #     games_abbr = pd.read_csv(f'{data_dir}/{date.strftime("%Y-%m-%d")}_abbr.csv')
    #     flag2 = True

    if not flag1 or not flag2:
        sleep(2)
        gamefinder = scoreboardv2.ScoreboardV2(game_date=date.date())
        games = gamefinder.get_data_frames()[0]
        games_abbr = gamefinder.get_data_frames()[1]
        # games.to_csv(f'{data_dir}/{date.strftime("%Y-%m-%d")}.csv')
        # games_abbr.to_csv(f'{data_dir}/{date.strftime("%Y-%m-%d")}_abbr.csv')
    for i in range(games.shape[0]):
        g = games.iloc[i]
        if g['GAME_ID'] in games_dict:
            continue
        # preseason, regular, playoff only
        if str(int(g['GAME_ID']))[0] != '1' and str(int(g['GAME_ID']))[0] != '2' and str(int(g['GAME_ID']))[0] != '4':
            continue
        
        game = {}
        date = g['GAME_DATE_EST'].split('T')[0].split('-')
        date = [int(i) for i in date]
        game_datetime = datetime.datetime(date[0], date[1], date[2]) + datetime.timedelta(days=1)
        game['gameDateTime'] = game_datetime
        
        if g['GAME_STATUS_TEXT'].find('Qtr') != -1:
            game['gameStatus'] = 'InProgress'
        elif g['GAME_STATUS_TEXT'] != 'Final' and g['GAME_STATUS_TEXT'] != 'TBD':
            time = g['GAME_STATUS_TEXT'].split(' ')[0].split(':')
            time = [int(t) for t in time]
            am_pm = g['GAME_STATUS_TEXT'].split(' ')[1]
            # UTC-4 to UTC+8
            if am_pm == 'pm':
                time[0] = time[0] + 12
            game['gameDateTime'] = game_datetime = datetime.datetime(date[0], date[1], date[2], time[0], time[1]) + datetime.timedelta(hours=12)
            game['gameStatus'] = 'Todo'
        else:
            game['gameStatus'] = g['GAME_STATUS_TEXT']
    
        game['gameID'] = str(int(g['GAME_ID']))
        game['seasonType'] = season_type[str(int(g['GAME_ID']))[0]]
        game['homeTeam'] = id2team[g['HOME_TEAM_ID']]['full_name']
        game['homeTeamAbbr'] = id2team[g['HOME_TEAM_ID']]['abbreviation']
        game['visitorTeam'] = id2team[g['VISITOR_TEAM_ID']]['full_name']
        game['visitorTeamAbbr'] = id2team[g['VISITOR_TEAM_ID']]['abbreviation']
        game['homeTeamScore'] = games_abbr[games_abbr['TEAM_ABBREVIATION'] == game['homeTeamAbbr']]['PTS'].item()
        game['visitorTeamScore'] = games_abbr[games_abbr['TEAM_ABBREVIATION'] == game['visitorTeamAbbr']]['PTS'].item()
        print(game) 
        
        schedule_collection.update_one({"gameID": game['gameID']}, {"$set": game}, upsert=True)
            
        games_dict[game['gameID']] = game
