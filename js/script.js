import httpService from "../services/http.js";

const { request } = httpService();
//const dataGenealogy = request("https://coldnaked.pockethost.io/api/collections/genealogy/records");


function convertToDTreeFormat(serverData) {
const idMap = new Map();

// First pass: create nodes
serverData.forEach(person => {
    idMap.set(person.id, {
        name: person.name,
        class: person.gender === 'M' ? 'man' : 'woman',
        textClass: "nodeText",
        depthOffset: 1,
        extra: {
            birthDate: person.date_of_birth,
            deathDate: person.date_of_death,
            birthPlace: person.place_of_birth,
            deathPlace: person.place_of_death,
            info: person.information
        },
        marriages: []
    });
});

// Second pass: establish relationships
serverData.forEach(person => {
    const node = idMap.get(person.id);
    // Add partner
    if (person.partner && person.partner.partner) {
        const spouse = idMap.get(person.partner.partner);
        if (spouse) {
            node.marriages.push({
                spouse: spouse,
                children: []
            });
        }
    }

    // Add children to marriage
    if (person.children && person.children.children) {
        const marriage = node.marriages[0] || { spouse: {}, children: [] };
        person.children.children.forEach(childId => {
            const child = idMap.get(childId);
            if (child) {
                marriage.children.push(child);
            }
        });
        if (!node.marriages[0]) {
            node.marriages.push(marriage);
        }
    }
});

// Find the root node (person without parents)
const root = serverData.find(person => !person.parents || !person.parents.parents);
return root ? [idMap.get(root.id)] : [];
}

request("https://coldnaked.pockethost.io/api/collections/genealogy/records")
    .then( response => {
            console.log(response.items);
            var treeData = convertToDTreeFormat(response.items);
            dTree.init(treeData, {
                target: "#graph",
                debug: true,
                hideMarriageNodes: true,
                marriageNodeSize: 5,
                height: 800,
                width: 1200,
                nodeWidth: 130,
                callbacks: {
                    nodeClick: function(name, extra) {
                        alert('Click: ' + name + '\n' + JSON.stringify(extra, null, 2));
                    },
                    nodeRightClick: function(name, extra) {
                        alert('Right-click: ' + name);
                    },
                    textRenderer: function(name, extra, textClass) {
                        var text = "<div style='width: 120px; padding: 5px; word-wrap: break-word;'>";
                        text += "<p align='center' class='" + textClass + "' style='margin-bottom: 5px; font-weight: bold;'>" + name + "</p>";
                        if (extra) {
                            text += "<p align='center' style='margin-bottom: 3px;'>" + (extra.birthDate || '') + " - " + (extra.deathDate || '') + "</p>";
                            if (extra.birthPlace) text += "<p align='center'>" + extra.birthPlace + "</p>";
                        }
                        return text;
                    },
                    marriageClick: function(extra, id) {
                        alert('Clicked marriage node ' + id);
                    },
                    marriageRightClick: function(extra, id) {
                        alert('Right-clicked marriage node ' + id);
                    },
                }
            });
        });

// d3.json("genealogy.json", function(error, serverData) {
//     if (error) {
//         console.error("Error loading the data:", error);
//         return;
//     }

//     var treeData = convertToDTreeFormat(serverData);
//     dTree.init(treeData, {
//         target: "#graph",
//         debug: true,
//         hideMarriageNodes: true,
//         marriageNodeSize: 5,
//         height: 800,
//         width: 1200,
//         nodeWidth: 130,
//         callbacks: {
//             nodeClick: function(name, extra) {
//                 alert('Click: ' + name + '\n' + JSON.stringify(extra, null, 2));
//             },
//             nodeRightClick: function(name, extra) {
//                 alert('Right-click: ' + name);
//             },
//             textRenderer: function(name, extra, textClass) {
//                 var text = "<div style='width: 120px; padding: 5px; word-wrap: break-word;'>";
//                 text += "<p align='center' class='" + textClass + "' style='margin-bottom: 5px; font-weight: bold;'>" + name + "</p>";
//                 if (extra) {
//                     text += "<p align='center' style='margin-bottom: 3px;'>" + (extra.birthDate || '') + " - " + (extra.deathDate || '') + "</p>";
//                     if (extra.birthPlace) text += "<p align='center'>" + extra.birthPlace + "</p>";
//                 }
//                 return text;
//             },
//             marriageClick: function(extra, id) {
//                 alert('Clicked marriage node ' + id);
//             },
//             marriageRightClick: function(extra, id) {
//                 alert('Right-clicked marriage node ' + id);
//             },
//         }
//     });
// });