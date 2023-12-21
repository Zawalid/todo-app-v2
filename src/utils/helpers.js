export function remove$Properties(updatedTask) {
    for (let prop in updatedTask) {
        if (prop.startsWith('$')) {
            delete updatedTask[prop];
        }
    }
}
