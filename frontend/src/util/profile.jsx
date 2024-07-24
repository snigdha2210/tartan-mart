export function filterArchive(items){
    var archived_items2 = [];
    for (const item in items){
        if (items[item].current_status.toLowerCase() === 'archived'){
            archived_items2.push(items[item]);
        }
    }
    return archived_items2;
}

export function filterActiveSold(items){
    var my_items2 = [];
    for (const item in items){
        if (items[item].current_status.toLowerCase() === 'listed' || items[item].current_status.toLowerCase() === 'sold'){
            my_items2.push(items[item]);
        }
    }
    return my_items2;
}

export function findItem(items, id){
    for (const item in items){
        if (items[item].id === id){
            return items[item];
        }
    }
    return {}
}