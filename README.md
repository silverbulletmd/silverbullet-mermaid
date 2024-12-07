# Silver Bullet plug for diagrams (online)

This plug adds basic [Mermaid](https://mermaid.js.org/) and [Plantuml](https://plantuml.com) support to Silver Bullet.

**Note:** The Mermaid/Plantuml library itself is not bundled with this plug, it pulls the JavaScript from the JSDelivr CDN. This means _this plug will not work without an Internet connection_. The reason for this is primarily plug size (bundling the library would amount to 1.1MB). This way Mermaid/Plantuml is only loaded on pages with actual Mermaid/Plantuml diagrams rather than on every SB load.

## Installation

Run the {[Plugs: Add]} command and paste in: `github:malys/silverbullet-diagrams/diagrams.plug.js`

That's all!

## Use

Put a mermaid block in your markdown:

    ```diagrams     
        flowchart TD         
        Start --> Stop     
    ```

Put a plantuml block in your markdown:

    ```diagrams
        @startuml
        Alice -> Bob: Authentication Request
        Bob --> Alice: Authentication Response

    Alice -> Bob: Another authentication Request
        Alice <-- Bob: Another authentication Response
        @enduml
    ```

And move your cursor outside of the block to live preview it!
