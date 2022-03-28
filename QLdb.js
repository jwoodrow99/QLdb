class QLdb {
	constructor(dbName) {
		this.dbName = dbName;
		// this.db = this.readRaw();

		this.db = false;

		if (!this.db) {
			this.db = this.writeRaw({
				name: dbName,
				createdAt: Date.now(),
				updatedAt: Date.now(),
				collections: {},
			});
		}
	}

	collections() {
		return Object.keys(this.db.collections);
	}

	collectionInfo(collectionName) {
		let collection = this.db.collections[collectionName];

		// If collection exists
		if (collection) {
			return {
				name: collectionName,
				createdAt: collection.createdAt,
				updatedAt: collection.updatedAt,
				documentCount: collection.documents.length,
				template: collection.template,
			};
		} else {
			console.error(`Collection "${collectionName}" does not exists.`);
		}
	}

	deleteCollection(collectionName) {
		this.updateRaw((db) => {
			let collection = db.collections[collectionName];

			// If collection exists
			if (collection) {
				delete db.collections[collectionName];
				return db;
			} else {
				console.error(`Collection "${collectionName}" does not exists.`);
			}
		});
	}

	destroy() {
		localStorage.removeItem(this.dbName);
	}

	readRaw() {
		return JSON.parse(localStorage.getItem(this.dbName));
	}

	writeRaw(obj) {
		localStorage.setItem(this.dbName, JSON.stringify(obj));
		return obj;
	}

	updateRaw(cb) {
		let db = this.readRaw();
		this.db = this.writeRaw(cb(db));
	}

	clone(obj) {
		return JSON.parse(JSON.stringify(obj));
	}

	newCollection(name, template = null) {
		this.updateRaw((db) => {
			if (!Object.keys(db.collections).includes(name)) {
				db.collections[name] = {
					createdAt: Date.now(),
					updatedAt: Date.now(),
					template: template,
					documents: [],
				};
			} else {
				console.error(`Collection "${name}" already exists.`);
			}
			return db;
		});
	}

	insert(collectionName, document) {
		this.updateRaw((db) => {
			let collection = db.collections[collectionName];

			// If collection exists
			if (collection) {
				let validatedDoc = {};

				// Validate document against collection template
				if (collection.template) {
					// Loop over collection template fields
					Object.keys(collection.template).forEach((templateKey) => {
						// Verify type and key of each field
						if (
							typeof document[templateKey] === collection.template[templateKey]
						) {
							validatedDoc[templateKey] = document[templateKey];
						} else {
							console.error('Document does not match collection template.');
							return;
						}
					});
				}

				collection.documents.push({
					_id: crypto.randomUUID(),
					createdAt: Date.now(),
					updatedAt: Date.now(),
					...validatedDoc,
				});
			} else {
				console.error(`Collection "${collectionName}" does not exists.`);
			}

			db.collections[collectionName] = collection;
			return db;
		});
	}

	findId(collectionName, id) {
		let collection = this.db.collections[collectionName];

		// If collection exists
		if (collection) {
			return collection.documents.filter((doc) => {
				if (doc._id === id) {
					return doc;
				}
			})[0];
		} else {
			console.error(`Collection "${collectionName}" does not exists.`);
		}
	}

	find(collectionName, conditions = {}) {
		let collection = this.db.collections[collectionName];

		// If collection exists
		if (collection) {
			// If no condition
			if (Object.keys(conditions).length == 0) {
				return collection.documents;
			} else {
				return collection.documents.filter((doc) => {
					let returnVal = true;

					Object.keys(conditions).forEach((cond) => {
						if (doc[cond] !== conditions[cond]) {
							returnVal = false;
						}
					});

					if (returnVal) {
						return doc;
					}
				});
			}
		} else {
			console.error(`Collection "${collectionName}" does not exists.`);
		}
	}

	updateId(collectionName, id, updateValues) {
		this.updateRaw((db) => {
			let collection = db.collections[collectionName];

			// If collection exists
			if (collection) {
				db[collectionName] = collection.documents.map((doc) => {
					if (doc._id === id) {
						Object.keys(updateValues).forEach((key) => {
							doc[key] = updateValues[key];
						});
					}
					return doc;
				});

				return db;
			} else {
				console.error(`Collection "${collectionName}" does not exists.`);
			}
		});
	}

	update(collectionName, conditions, updateValues) {
		this.updateRaw((db) => {
			let collection = db.collections[collectionName];

			// If collection exists
			if (collection) {
				db[collectionName] = collection.documents.map((doc) => {
					let match = true;

					// Check if conditions match record
					Object.keys(conditions).forEach((cond) => {
						if (doc[cond] !== conditions[cond]) {
							match = false;
						}
					});

					if (match) {
						Object.keys(updateValues).forEach((key) => {
							doc[key] = updateValues[key];
						});
					}
					return doc;
				});
				return db;
			} else {
				console.error(`Collection "${collectionName}" does not exists.`);
			}
		});
	}

	deleteId(collectionName, id) {
		this.updateRaw((db) => {
			let collection = db.collections[collectionName];
			// If collection exists
			if (collection) {
				db[collectionName] = collection.documents.filter((doc) => {
					if (doc._id !== id) {
						return doc;
					}
				});
				return db;
			} else {
				console.error(`Collection "${collectionName}" does not exists.`);
			}
		});
	}

	delete(collectionName, conditions = {}) {
		this.updateRaw((db) => {
			let collection = db.collections[collectionName];

			// If collection exists
			if (collection) {
				db[collectionName] = collection.documents.filter((doc) => {
					let match = true;

					// Check if conditions match record
					Object.keys(conditions).forEach((cond) => {
						if (doc[cond] !== conditions[cond]) {
							match = false;
						}
					});

					// if match exists
					if (match) {
						return doc;
					}
				});
				return db;
			} else {
				console.error(`Collection "${collectionName}" does not exists.`);
			}
		});
	}
}
