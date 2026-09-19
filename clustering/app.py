from flask import Flask, request, jsonify
from sklearn.cluster import KMeans

app = Flask(__name__)

@app.route('/cluster', methods=['POST'])
def cluster():
    data = request.get_json()
    points = data['points']
    days = data['days']

    kmeans = KMeans(n_clusters=days)
    labels = kmeans.fit_predict(points)
    
    grouped = {}
    for point, label in zip(points,labels):
        label = int(label)
        if label not in grouped:
            grouped[label]=[]
            
        grouped[label].append(point)
    
    return jsonify(grouped)


if __name__ == '__main__':
    app.run(port=5001)