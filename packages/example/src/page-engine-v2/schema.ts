const schema = {
  "node": {
    "id": "page-zl5k7Cqi",
    "pid": "",
    "type": "react-component",
    "packageName": "ofa-ui",
    "packageVersion": "latest",
    "exportName": "page",
    "label": "页面",
    "props": {
      "style": {
        "type": "constant_property",
        "value": {
          "width": "100%",
          "height": "100%"
        }
      }
    },
    "children": [
      {
        "exportName": "grid",
        "label": "布局容器",
        "defaultConfig": {
          "colRatio": "12:9:3",
          "colGap": "16px",
          "rowGap": "16px"
        },
        "defaultStyle": {
          "marginBottom": 16
        },
        "children": [
          {
            "id": "container-ije-_lMI",
            "pid": "grid-sRUjgGbf",
            "type": "react-component",
            "exportName": "container",
            "packageName": "ofa-ui",
            "packageVersion": "latest",
            "label": "容器",
            "props": {
              "style": {
                "type": "constant_property",
                "value": {
                  "display": "flex",
                  "flexFlow": "column nowrap",
                  "justifyContent": "flex-start",
                  "alignItems": "stretch",
                  "gridArea": "span 1 / span 12 / auto / auto",
                  "minWidth": "auto"
                }
              },
              "id": {
                "type": "constant_property",
                "value": "container-ije-_lMI"
              }
            },
            "children": [
              {
                "exportName": "para",
                "label": "段落",
                "defaultConfig": {
                  "content": "段落文本",
                  "maxLength": 5,
                  "isAllowSelect": false,
                  "isAllowSpace": false
                },
                "defaultStyle": {},
                "id": "para-B9qa8ceK",
                "pid": "container-ije-_lMI",
                "supportStateExposure": true,
                "type": "react-component",
                "packageName": "ofa-ui",
                "packageVersion": "latest",
                "props": {
                  "id": {
                    "type": "constant_property",
                    "value": "para-B9qa8ceK"
                  },
                  "content": {
                    "type": "constant_property",
                    "value": "段落文本"
                  },
                  "maxLength": {
                    "type": "constant_property",
                    "value": 5
                  },
                  "isAllowSelect": {
                    "type": "constant_property",
                    "value": false
                  },
                  "isAllowSpace": {
                    "type": "constant_property",
                    "value": false
                  }
                }
              }
            ]
          },
          {
            "id": "container-u_fCHYZo",
            "pid": "grid-sRUjgGbf",
            "type": "react-component",
            "exportName": "container",
            "packageName": "ofa-ui",
            "packageVersion": "latest",
            "label": "容器",
            "props": {
              "style": {
                "type": "constant_property",
                "value": {
                  "display": "flex",
                  "flexFlow": "column nowrap",
                  "justifyContent": "flex-start",
                  "alignItems": "stretch",
                  "gridArea": "span 1 / span 9 / auto / auto",
                  "minWidth": "auto"
                }
              },
              "id": {
                "type": "constant_property",
                "value": "container-u_fCHYZo"
              }
            },
            "children": [
              {
                "exportName": "button",
                "label": "按钮",
                "defaultConfig": {
                  "title": "按钮",
                  "modifier": "primary",
                  "type": "button",
                  "size": "normal",
                  "iconSize": 12,
                  "iconName": "",
                  "preview": false,
                  "closeOnMaskClick": false
                },
                "defaultStyle": {},
                "id": "button-BZfoW81N",
                "pid": "container-u_fCHYZo",
                "supportStateExposure": true,
                "type": "react-component",
                "packageName": "ofa-ui",
                "packageVersion": "latest",
                "props": {
                  "id": {
                    "type": "constant_property",
                    "value": "button-BZfoW81N"
                  },
                  "title": {
                    "type": "constant_property",
                    "value": "按钮"
                  },
                  "modifier": {
                    "type": "constant_property",
                    "value": "primary"
                  },
                  "type": {
                    "type": "constant_property",
                    "value": "button"
                  },
                  "size": {
                    "type": "constant_property",
                    "value": "normal"
                  },
                  "iconSize": {
                    "type": "constant_property",
                    "value": 12
                  },
                  "iconName": {
                    "type": "constant_property",
                    "value": ""
                  },
                  "preview": {
                    "type": "constant_property",
                    "value": false
                  },
                  "closeOnMaskClick": {
                    "type": "constant_property",
                    "value": false
                  },
                  "onClick": {
                    "type": "constant_property"
                  }
                }
              }
            ]
          },
          {
            "id": "container-fCOvu2P3",
            "pid": "grid-sRUjgGbf",
            "type": "react-component",
            "exportName": "container",
            "packageName": "ofa-ui",
            "packageVersion": "latest",
            "label": "容器",
            "props": {
              "style": {
                "type": "constant_property",
                "value": {
                  "display": "flex",
                  "flexFlow": "column nowrap",
                  "justifyContent": "flex-start",
                  "alignItems": "stretch",
                  "gridArea": "span 1 / span 3 / auto / auto",
                  "minWidth": "auto"
                }
              },
              "id": {
                "type": "constant_property",
                "value": "container-fCOvu2P3"
              }
            },
            "children": [
              {
                "exportName": "link",
                "label": "链接",
                "defaultConfig": {
                  "content": "链接",
                  "linkType": "outside",
                  "linkUrl": "",
                  "linkPage": "",
                  "isBlank": false
                },
                "defaultStyle": {},
                "id": "link-2M8Mg2sz",
                "pid": "container-fCOvu2P3",
                "supportStateExposure": true,
                "type": "react-component",
                "packageName": "ofa-ui",
                "packageVersion": "latest",
                "props": {
                  "id": {
                    "type": "constant_property",
                    "value": "link-2M8Mg2sz"
                  },
                  "content": {
                    "type": "constant_property",
                    "value": "链接"
                  },
                  "linkType": {
                    "type": "constant_property",
                    "value": "outside"
                  },
                  "linkUrl": {
                    "type": "constant_property",
                    "value": ""
                  },
                  "linkPage": {
                    "type": "constant_property",
                    "value": ""
                  },
                  "isBlank": {
                    "type": "constant_property",
                    "value": false
                  }
                }
              }
            ]
          }
        ],
        "id": "grid-sRUjgGbf",
        "pid": "page-zl5k7Cqi",
        "supportStateExposure": true,
        "type": "react-component",
        "packageName": "ofa-ui",
        "packageVersion": "latest",
        "props": {
          "id": {
            "type": "constant_property",
            "value": "grid-sRUjgGbf"
          },
          "colRatio": {
            "type": "constant_property",
            "value": "12:9:3"
          },
          "colGap": {
            "type": "constant_property",
            "value": "16px"
          },
          "rowGap": {
            "type": "constant_property",
            "value": "16px"
          }
        }
      }
    ]
  },
  "apiStateSpec": {},
  "sharedStatesSpec": {}
}
