from flask import render_template, request, redirect, url_for, flash, session
from app import app, db
from models import User, Tweet

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']

        # Check if the username or email already exists in the database
        if User.query.filter_by(username=username).first() or User.query.filter_by(email=email).first():
            flash('Username or email already exists. Please choose a different one.', 'danger')
            return redirect(url_for('signup'))

        new_user = User(username=username, email=email)
        new_user.set_password(password)

        db.session.add(new_user)
        db.session.commit()

        flash('Account created successfully. You can now log in.', 'success')
        return redirect(url_for('signin'))

    return render_template('signup.html')

@app.route('/signin', methods=['GET', 'POST'])
def signin():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        user = User.query.filter_by(username=username).first()

        if user and user.check_password(password):
            # TODO: Implement session handling for user authentication (e.g., Flask-Login)
            flash('Login successful!', 'success')
            return redirect(url_for('index'))
        else:
            flash('Invalid username or password. Please try again.', 'danger')

    return render_template('signin.html')

@app.route('/')
def index():
    tweets = Tweet.query.all()
    return render_template('index.html', tweets=tweets)

@app.route('/add_tweet', methods=['POST'])
def add_tweet():
    content = request.form['content']
    new_tweet = Tweet(content=content)
    db.session.add(new_tweet)
    db.session.commit()
    return redirect(url_for('index'))

@app.route('/delete_tweet/<int:tweet_id>', methods=['POST'])
def delete_tweet(tweet_id):
    tweet = Tweet.query.get_or_404(tweet_id)
    db.session.delete(tweet)
    db.session.commit()
    return redirect(url_for('index'))

@app.route('/edit_tweet/<int:tweet_id>', methods=['GET', 'POST'])
def edit_tweet(tweet_id):
    tweet = Tweet.query.get_or_404(tweet_id)

    if request.method == 'POST':
        new_content = request.form['content']
        tweet.content = new_content
        db.session.commit()
        return redirect(url_for('index'))

    return render_template('edit_tweet.html', tweet=tweet)