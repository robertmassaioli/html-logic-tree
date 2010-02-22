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
      type : "Op",
      value : "and",
      children : [
          {
              name : "A",
              type : "Val",
              value : "true" 
          },
          {
              name : "B",
              type : "Val",
              value : "false" 
          } 
      ] 
  });
}

// same as two but the Or operator
function test3() {
  return ({
      type : "Op",
      value : "or",
      children : [
          {
              name : "A",
              type : "Val",
              value : "true" 
          },
          {
              name : "B",
              type : "Val",
              value : "false" 
          } 
      ] 
  });
}

// same as two but the Or operator
function test4() {
  return (
{
    "type" : "Op",
    "value" : "and",
    "children" : [
        {
            "type" : "Op",
            "value" : "or",
            "children" : [
                {
                    "name" : "A",
                    "type" : "Val",
                    "value" : "true" 
                },
                {
                    "name" : "B",
                    "type" : "Val",
                    "value" : "false" 
                } 
            ] 
        },
        {
            "type" : "Op",
            "value" : "or",
            "children" : [
                {
                    "name" : "C",
                    "type" : "Val",
                    "value" : "true" 
                },
                {
                    "name" : "D",
                    "type" : "Val",
                    "value" : "false" 
                } 
            ] 
        } 
    ]
}
);
}
