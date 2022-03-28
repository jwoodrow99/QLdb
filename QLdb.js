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

	find(collectionName, conditions) {
		let collection = this.db.collections[collectionName];
		let matching = [];

		// If collection exists
		if (collection) {
			for (let i = 0; i < Object.keys(collection.documents).length; i++) {
				for (let j = 0; j < Object.keys(conditions).length; j++) {
					let curMatch = true;

					if (
						collection.records[i][Object.keys(conditions)[j]] ==
							property[Object.keys(conditions)[j]] &&
						curMatch == true
					) {
						curMatch = true;
					} else {
						curMatch = false;
					}

					if (j == Object.keys(conditions).length - 1 && curMatch == true) {
						matching[i] = collection.records[i];
					}
				}
			} // end for

			return matching;
		} else {
			console.error(`Collection "${collectionName}" does not exists.`);
		}
	}
}
