from flask import Flask

app = Flask(__name__)

@app.route('/cluster', methods=['POST'])
def cluster():
    return "Hello"

if __name__ == '__main__':
    app.run(port=5001)