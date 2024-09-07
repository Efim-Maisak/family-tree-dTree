import httpService from "../services/http.js";

const { request, isLoading, isError } = httpService();
//const dataGenealogy = request("https://coldnaked.pockethost.io/api/collections/genealogy/records");


function convertToDTreeFormat(data) {
    const nodeMap = new Map();
    let rootNode = null;

    // Создаем узлы для каждого человека
    data.forEach(person => {
        if (!nodeMap.has(person.id)) {
            const node = {
                name: person.name,
                class: person.gender === 'M' ? 'man' : 'woman',
                textClass: "nodeText",
                depthOffset: 1,
                extra: {
                    id: person.id,
                    birthDate: person.date_of_birth,
                    deathDate: person.date_of_death,
                    birthPlace: person.place_of_birth,
                    deathPlace: person.place_of_death,
                    information: person.information
                },
                marriages: []
            };
            nodeMap.set(person.id, node);
        }
    });

    // Находим корневой узел (самый старший предок)
    let oldestPerson = data.reduce((oldest, current) => {
        const oldestBirth = oldest.date_of_birth ? parseInt(oldest.date_of_birth.split('.')[2] || oldest.date_of_birth) : Infinity;
        const currentBirth = current.date_of_birth ? parseInt(current.date_of_birth.split('.')[2] || current.date_of_birth) : Infinity;
        return currentBirth < oldestBirth ? current : oldest;
    });
    rootNode = nodeMap.get(oldestPerson.id);

    // Функция для создания узла неизвестного супруга
    function createUnknownSpouse() {
        return {
            name: "неизвестно",
            class: "unknown",
            textClass: "nodeText",
            extra: {
                id: "unknown-" + Math.random().toString(36).substr(2, 9),
                birthDate: "",
                deathDate: "",
                birthPlace: "",
                deathPlace: "",
                information: "Информация отсутствует"
            }
        };
    }

    // Устанавливаем связи между узлами
    data.forEach(person => {
        const node = nodeMap.get(person.id);

        // Добавляем супруга
        if (person.partner && person.partner.spouse) {
            const spouseNode = nodeMap.get(person.partner.spouse);
            if (spouseNode && !node.marriages.some(m => m.spouse.extra.id === spouseNode.extra.id)) {
                node.marriages.push({ spouse: spouseNode, children: [] });
            }
        }

        // Добавляем детей
        if (person.children && person.children.children) {
            person.children.children.forEach(childId => {
                const childNode = nodeMap.get(childId);
                if (childNode) {
                    let marriage = node.marriages.find(m => m.children.some(c => c.extra.id === childId));
                    if (!marriage) {
                        if (node.marriages.length === 0) {
                            node.marriages.push({ spouse: createUnknownSpouse(), children: [] });
                        }
                        marriage = node.marriages[0];
                    }
                    if (!marriage.children.some(c => c.extra.id === childId)) {
                        marriage.children.push(childNode);
                    }
                }
            });
        }
    });

    // Рекурсивная функция для построения дерева
    function buildTree(node) {
        node.marriages.forEach(marriage => {
            marriage.children = marriage.children.map(child => buildTree(child));
        });
        return node;
    }

    return [buildTree(rootNode)];
}



request("https://coldnaked.pockethost.io/api/collections/genealogy/records")
    .then( response => {
            console.log(response.items);
            let treeData = convertToDTreeFormat(response.items);
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
                        if(name == "неизвестно") {
                            return text;
                        }
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

