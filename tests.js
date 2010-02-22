// test for basic node
function test1() {
    return ({
        name: "node",
        type: "Val",
        value: "true"
    });
}

// a test for the and operator
function test2() {
    return ({
        type: "Op",
        value: "and",
        child: [{
            name: "A",
            type: "Val",
            value: "true"
        },
        {
            name: "B",
            type: "Val",
            value: "false"
        }]
    });
}

// same as two but the Or operator
function test3() {
    return ({
        type: "Op",
        value: "or",
        child: [{
            name: "A",
            type: "Val",
            value: "true"
        },
        {
            name: "B",
            type: "Val",
            value: "false"
        }]
    });
}

// same as two but the Or operator
function test4() {
    return ({
        "type": "Op",
        "value": "and",
        "child": [{
            "type": "Op",
            "value": "or",
            "child": [{
                "name": "A",
                "type": "Val",
                "value": "true"
            },
            {
                "name": "B",
                "type": "Val",
                "value": "false"
            }]
        },
        {
            "type": "Op",
            "value": "or",
            "child": [{
                "name": "C",
                "type": "Val",
                "value": "true"
            },
            {
                "name": "D",
                "type": "Val",
                "value": "false"
            }]
        }]
    });
}

function test5() {
    return ({
        "type": "Op",
        "value": "or",
        "child": [{
            "type": "Op",
            "value": "and",
            "child": [{
                "name": "A",
                "type": "Val",
                "value": "true"
            },
            {
                "name": "B",
                "type": "Val",
                "value": "false"
            }]
        },
        {
            "type": "Op",
            "value": "and",
            "child": [{
                "name": "C",
                "type": "Val",
                "value": "true"
            },
            {
                "name": "D",
                "type": "Val",
                "value": "false"
            }]
        }]
    });
}

// same as two but the Or operator
function test6() {
    return ({
        "type": "Op",
        "value": "and",
        "child": [{
            "type": "Op",
            "value": "or",
            "child": [{
                "name": "A",
                "type": "Val",
                "value": "true"
            },
            {
                "name": "B",
                "type": "Val",
                "value": "false"
            }]
        },
        {
            "name": "C",
            "type": "Val",
            "value": "true",
        }]
    });
}

// This is two or's
function test7() {
    return ({
        "type": "Op",
        "value": "or",
        "child": [{
            "type": "Op",
            "value": "or",
            "child": [{
                "name": "A",
                "type": "Val",
                "value": "true"
            },
            {
                "name": "B",
                "type": "Val",
                "value": "false"
            }]
        },
        {
            "name": "C",
            "type": "Val",
            "value": "true",
        }]
    });
}
