from flask import Flask, request, jsonify, session, redirect, url_for
import requests
from requests.auth import HTTPBasicAuth
from flask_cors import CORS
import urllib

app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "http://localhost:5174"}})

# Spotify API credentials
OPENAI_API_KEY = 'sk-proj-rVBDMCquJH9co76a2HAnT3BlbkFJVvq1OTbRvZ0JpR4WEmms'
SPOTIFY_REDIRECT_URI = 'http://localhost:5000/callback'
SPOTIFY_CLIENT_ID = '575a6c03cd55436faf25dbddfe4ba5b4'
SPOTIFY_CLIENT_SECRET = '45b3a09d9acf4a6684258cc925f55c41'

def get_spotify_access_token():
    auth_url = 'https://accounts.spotify.com/api/token'
    response = requests.post(
        auth_url,
        data={'grant_type': 'client_credentials'},
        auth=HTTPBasicAuth(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET)
    )
    response.raise_for_status()
    return response.json()['access_token']

@app.route('/login')
def login():
    scope = 'user-read-private user-read-email'
    params = {
        'client_id': SPOTIFY_CLIENT_ID,
        'response_type': 'code',
        'redirect_uri': SPOTIFY_REDIRECT_URI,
        'scope': scope
    }
    auth_url = 'https://accounts.spotify.com/authorize?' + urllib.parse.urlencode(params)
    return redirect(auth_url)

@app.route('/callback')
def callback():
    auth_code = request.args.get('code')
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    data = {
        'grant_type': 'authorization_code',
        'code': auth_code,
        'redirect_uri': SPOTIFY_REDIRECT_URI,
        'client_id': SPOTIFY_CLIENT_ID,
        'client_secret': SPOTIFY_CLIENT_SECRET
    }
    token_response = requests.post('https://accounts.spotify.com/api/token', headers=headers, data=data)
    token_data = token_response.json()
    session['access_token'] = token_data['access_token']
    return redirect(url_for('profile'))

@app.route('/top-content', methods=['GET'])
def get_top_content():
    access_token = get_spotify_access_token()
    if not access_token:
        return redirect(url_for('login'))

    headers = {'Authorization': f'Bearer ' + access_token}
    top_tracks_response = requests.get('https://api.spotify.com/v1/me/top/tracks?limit=10', headers=headers)
    top_artists_response = requests.get('https://api.spotify.com/v1/me/top/artists?limit=3', headers=headers)

    if top_tracks_response.status_code != 200:
        return jsonify({'error': 'Failed to fetch top tracks'}), top_tracks_response.status_code
    if top_artists_response.status_code != 200:
        return jsonify({'error': 'Failed to fetch top artists'}), top_artists_response.status_code

    top_tracks = top_tracks_response.json().get('items', [])
    top_artists = top_artists_response.json().get('items', [])

    top_tracks_list = [{'name': track['name'], 'artist': track['artists'][0]['name']} for track in top_tracks]
    top_artists_list = [artist['name'] for artist in top_artists]

    return jsonify({'top_tracks': top_tracks_list, 'top_artists': top_artists_list})

@app.route('/generate-keywords', methods=['POST'])
def generate_keywords():
    data = request.get_json()
    top_tracks = data['topTracks']
    top_artists = data['topArtists']

    prompt = f"Here are the top 10 tracks and top 3 artists from Spotify:\n\nTop Tracks:\n"
    prompt += "\n".join([f"{i+1}. {track['name']} by {track['artists'][0]['name']}" for i, track in enumerate(top_tracks)])
    prompt += "\n\nTop Artists:\n"
    prompt += "\n".join([f"{i+1}. {artist['name']}" for i, artist in enumerate(top_artists)])
    prompt += "\n\nGenerate 10-15 keywords based on these tracks and artists."

    openai_response = requests.post(
        'https://api.openai.com/v1/engines/davinci-codex/completions',
        headers={'Authorization': f'Bearer {OPENAI_API_KEY}'},
        json={'prompt': prompt, 'max_tokens': 60}
    )

    keywords = openai_response.json()['choices'][0]['text'].strip().split(',')
    return jsonify({'keywords': [keyword.strip() for keyword in keywords]})

@app.route('/search-playlists', methods=['POST'])
def search_playlists():
    access_token = get_spotify_access_token()
    headers = {'Authorization': f'Bearer {access_token}'}
    keywords = request.json['keywords']

    playlists = []
    for keyword in keywords:
        response = requests.get(
            f'https://api.spotify.com/v1/search?q={keyword}&type=playlist&limit=5',
            headers=headers
        )
        playlists.extend(response.json()['playlists']['items'])

    return jsonify({'playlists': [{'name': playlist['name'], 'owner': playlist['owner']['display_name']} for playlist in playlists]})

@app.route('/sendartist', methods=['POST'])
def sendartist():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON data"}), 400

    print(data)
    return jsonify({"message": "Data received successfully"}), 200

if __name__ == '__main__':
    app.run(debug=False, host='localhost', port=5000)
