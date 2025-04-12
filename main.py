from flask import Flask, render_template, request, jsonify
from replit import db

app = Flask(__name__)

@app.route("/")
def index():
    items = db.get("items", [])
    history = db.get("history", [])
    past_market_names = db.get("history_market_names", [])
    market_name = db.get("market_name", "")
    return render_template("index.html", items=items, history=history, market_name=market_name, past_market_names=past_market_names)

@app.route("/add", methods=["POST"])
def add_item():
    data = request.json
    name = data.get("item_name")
    price = data.get("price")
    if not name:
        return jsonify(success=False), 400

    items = db.get("items", [])
    new_item = {
        "item_name": name,
        "price": price,
        "done": False
    }
    items.append(new_item)
    db["items"] = items
    return jsonify(success=True, item=new_item, index=len(items)-1)

@app.route("/toggle/<int:index>", methods=["POST"])
def toggle_item(index):
    items = db.get("items", [])
    items[index]["done"] = not items[index]["done"]
    db["items"] = items
    return jsonify(success=True)

@app.route("/edit/<int:index>", methods=["POST"])
def edit_item(index):
    data = request.json
    items = db.get("items", [])
    items[index]["item_name"] = data.get("item_name")
    items[index]["price"] = data.get("price")
    db["items"] = items
    return jsonify(success=True)

@app.route("/delete/<int:index>", methods=["POST"])
def delete_item(index):
    items = db.get("items", [])
    items.pop(index)
    db["items"] = items
    return jsonify(success=True)

@app.route("/save", methods=["POST"])
def save_list():
    history = db.get("history", [])
    market_names = db.get("history_market_names", [])
    current = db.get("items", [])
    market = db.get("market_name", "")
    if current:
        history.append(current)
        market_names.append(market)
        db["history"] = history
        db["history_market_names"] = market_names
        db["items"] = []
        db["market_name"] = ""
    return jsonify(success=True)

@app.route("/delete_list/<int:index>", methods=["POST"])
def delete_list(index):
    history = db.get("history", [])
    market_names = db.get("history_market_names", [])
    if 0 <= index < len(history):
        history.pop(index)
        market_names.pop(index)
        db["history"] = history
        db["history_market_names"] = market_names
    return jsonify(success=True)

@app.route("/set_market", methods=["POST"])
def set_market():
    data = request.json
    market_name = data.get("market_name")
    db["market_name"] = market_name
    return jsonify(success=True)

@app.route("/edit_saved/<int:list_index>/<int:item_index>", methods=["POST"])
def edit_saved_item(list_index, item_index):
    data = request.json
    history = db.get("history", [])
    if 0 <= list_index < len(history) and 0 <= item_index < len(history[list_index]):
        history[list_index][item_index]["item_name"] = data.get("item_name")
        history[list_index][item_index]["price"] = data.get("price")
        db["history"] = history
        return jsonify(success=True)
    return jsonify(success=False), 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
@app.route("/toggle/<int:index>", methods=["POST"])
def toggle_item(index):
    items = db.get("items", [])
    items[index]["done"] = not items[index]["done"]
    db["items"] = items
    return jsonify(success=True)
