from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///twitter_clone.db'
db = SQLAlchemy(app)

class Tweet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(280), nullable=False)

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

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)



