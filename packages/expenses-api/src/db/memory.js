let nextId = 0;
const db = new Map();

class DatabaseError extends Error {
    constructor(name) {
        this.name = name;
    }
}

export function insert(expense) {
    const id = ++nextId;
    expense.id = id;
    expense.status = "pending";
    db.set(id, expense);
}

export function approve(id) {
    const item = db.get(id);
    if (!item) throw new DatabaseError("not found");
    item.status = "approved";
}

export function all({ status }) {
    let items = db.values();

    if (status) {
        items = items.filter((i) => i.status === status);
    }
    return items;
}
