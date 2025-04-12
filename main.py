from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

items = []
history = []
market_name = ""

@app.route("/")
def index():
    return render_template("index.html", items=items, history=history, market_name=market_name, past_market_names=[])

@app.route("/add", methods=["POST"])
def add_item():
    data = request.json
    name = data.get("item_name")
    price = data.get("price")
    if not name:
        return jsonify(success=False), 400
    new_item = {"item_name": name, "price": price, "done": False}
    items.append(new_item)
    return jsonify(success=True, item=new_item, index=len(items) - 1)

@app.route("/toggle/<int:index>", methods=["POST"])
def toggle_item(index):
    items[index]["done"] = not items[index]["done"]
    return jsonify(success=True)

@app.route("/edit/<int:index>", methods=["POST"])
def edit_item(index):
    data = request.json
    items[index]["item_name"] = data.get("item_name")
    items[index]["price"] = data.get("price")
    return jsonify(success=True)

@app.route("/delete/<int:index>", methods=["POST"])
def delete_item(index):
    items.pop(index)
    return jsonify(success=True)

@app.route("/save", methods=["POST"])
def save_list():
    global history, items, market_name
    history.append(items.copy())
    items.clear()
    market_name = ""
    return jsonify(success=True)

@app.route("/set_market", methods=["POST"])
def set_market():
    global market_name
    market_name = request.json.get("market_name")
    return jsonify(success=True)

@app.route("/delete_list/<int:index>", methods=["POST"])
def delete_list(index):
    if 0 <= index < len(history):
        history.pop(index)
    return jsonify(success=True)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
