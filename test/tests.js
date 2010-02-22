// test for basic node
var testData = new Array();

testData.push ({
        name: "node",
        type: "Val",
        value: "false"
    });

// a test for the and operator
testData.push ({
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

// same as two but the Or operator
testData.push ({
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

// same as two but the Or operator
testData.push ({
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

testData.push ({
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

// same as two but the Or operator
testData.push ({
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
            "value": "true"
        }]
    });

// This is two or's
testData.push ({
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
            "value": "true"
        }]
    });

// This is three Or's, just to be sure.
testData.push ({
        "type": "Op",
        "value": "or",
        "child": [{
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
                    "name": "D",
                    "type": "Val",
                    "value": "true"
                }]
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
            "value": "true"
        }]
    });

// This is three And's, just to be sure.
testData.push ({
        "type": "Op",
        "value": "and",
        "child": [{
            "type": "Op",
            "value": "and",
            "child": [{
                "type": "Op",
                "value": "and",
                "child": [{
                    "name": "A",
                    "type": "Val",
                    "value": "true"
                },
                {
                    "name": "D",
                    "type": "Val",
                    "value": "maybe"
                }]
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
            "value": "true"
        }]
    });
