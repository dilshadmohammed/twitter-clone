from flask import Blueprint, request, jsonify
from models import User, Tweet, Like
from models import db
from sqlalchemy.sql import func
from sqlalchemy.orm import aliased
from werkzeug.security import generate_password_hash, check_password_hash


api = Blueprint('routes', __name__)

@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    name = data.get('name')
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if name and username and email and password:

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'error': 'Email is already registered'}), 400

        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

        new_user = User(name=name, username=username, email=email, password_hash=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            'user_id': new_user.user_id,
            'name': new_user.name,
            'username': new_user.username,
            'email': new_user.email
        }), 201
    else:
        return jsonify({'error': 'All fields (name, username, email, password) are required'}), 400


@api.route('/signin', methods=['POST'])
def signin():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if email and password:
        user = User.query.filter_by(email=email).first()

        if user and check_password_hash(user.password_hash, password):
        
            return jsonify({
                'user_id': user.user_id,
                'name': user.name,
                'username': user.username,
                'email': user.email
            })
        else:
            return jsonify({'error': 'Invalid email or password'}), 401
    else:
        return jsonify({'error': 'Email and password are required'}), 400



@api.route('/<int:user_id>',methods=['GET'])
def index(user_id):
    tweet_alias = aliased(Tweet)
    user_alias = aliased(User)

    tweets_with_likes = db.session.query(
        tweet_alias.tweet_id,
        tweet_alias.user_id,
        tweet_alias.content,
        user_alias.name,
        user_alias.username,
        func.count(Like.like_id).label('like_count'),
        func.count().filter(Like.user_id == user_id).label('user_liked')
        ).outerjoin(Like, Like.tweet_id == tweet_alias.tweet_id).\
        join(user_alias, user_alias.user_id == tweet_alias.user_id).\
        group_by(
            tweet_alias.tweet_id,
            tweet_alias.user_id,
            tweet_alias.content,
            user_alias.name,
            user_alias.username
        ).correlate(tweet_alias).all()

    formatted_tweets = [
        {
            'tweet_id': tweet[0],
            'user_id': tweet[1],
            'content': tweet[2],
            'name': tweet[3],
            'username': tweet[4],
            'like_count': tweet[5],
            'user_liked': tweet[6]
        }
        for tweet in tweets_with_likes
    ]

    return jsonify(formatted_tweets)

@api.route('/add-tweet', methods=['POST'])
def add_tweet():
    data = request.get_json()
    user_id = data.get('user_id')
    content = data.get('content')
    print(content)
    if user_id and content:
        new_tweet = Tweet(user_id=user_id, content=content)
        db.session.add(new_tweet)
        db.session.commit()
        print('tweet added')
        print(content)
        return jsonify({'message': 'Tweet submitted successfully'}), 201
    else:
        return jsonify({'error': 'User ID and content are required'}), 400


@api.route('/delete-tweet/<int:user_id>/<int:tweet_id>', methods=['POST'])
def delete_tweet(user_id, tweet_id):

    tweet = Tweet.query.get(tweet_id)
    if not tweet:
        return jsonify({'error': 'Tweet not found'}), 404

    if tweet.user_id != user_id:
        return jsonify({'error': 'Unauthorized to delete this tweet'}), 403

    db.session.delete(tweet)
    db.session.commit()

    return jsonify({'message': 'Tweet deleted successfully'}), 200


@api.route('/edit-tweet/<int:user_id>/<int:tweet_id>', methods=['POST'])
def edit_tweet(user_id, tweet_id):
    data = request.get_json()
    new_content = data.get('content')

    if not new_content:
        return jsonify({'error': 'New content is required'}), 400

    tweet = db.session.query(Tweet).get(tweet_id)

    if not tweet:
        return jsonify({'error': 'Tweet not found'}), 404

    if tweet.user_id != user_id:
        return jsonify({'error': 'Unauthorized to edit this tweet'}), 403

    tweet.content = new_content
    db.session.commit()

    return jsonify({'message': 'Tweet edited successfully'}), 200


@api.route('/like-unlike-tweet', methods=['POST'])
def like_unlike_tweet():
    data = request.get_json()

    user_id = data.get('user_id')
    tweet_id = data.get('tweet_id')

    user = db.session.query(User).get(user_id)
    tweet = db.session.query(Tweet).get(tweet_id)


    if not user or not tweet:
        return jsonify({'error': 'User or tweet not found'}), 404

    existing_like = db.session.query(Like).filter(
        Like.user_id == user_id,
        Like.tweet_id == tweet_id
    ).first()
    if existing_like:
        db.session.delete(existing_like)
        db.session.commit()
        return jsonify({'message': 'Tweet unliked successfully'}), 200
    else:
        new_like = Like(user_id=user_id, tweet_id=tweet_id)
        db.session.add(new_like)
        db.session.commit()
        return jsonify({'message': 'Tweet liked successfully'}), 200
