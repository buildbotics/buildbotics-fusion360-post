/**
 * This file generated by Chuck Tilbury Sept. 2019
 * 
 * This is a postprocessor for the Masso controller.
 */
include("GCodeBase.js");

function BuildBoticsIN(cadDocumentInterface, camDocumentInterface) {
    GCodeBase.call(this, cadDocumentInterface, camDocumentInterface);

    this.decimals = 4;
    this.unit = RS.Inch;
    this.outputOffsetPath = true;
    this.fileExtensions = ["nc"]
    this.lineNumber = 1000;
    this.lineNumberIncrement = 10;
    

    this.header = [
		"(Program name: [PROGRAM_NAME])",
		"(Imperial measure)",
		"(File: [FILENAME] -- [DATETIME])",
		"",
        "[N] G20 G17 G90 G80"
    ];

    this.footer = [
        "[N] M05",      // stop the spindle
        "[N] G0 X0 Y0", // reset to start location
        "[N] M30", 		// rewind the program
        "(end program)",
        "" 
    ]; 
    
    this.toolpathHeader = [
		"",
		"(Begin Tool Path [TOOLPATH_INDEX]: [TOOLPATH_NAME])"
    ];
    
    this.toolpathFooter = [
		"(End Tool Path [TOOLPATH_INDEX]: [TOOLPATH_NAME])",
		""
    ];
    
}

// Configuration is derived from GCodeBase:
BuildBoticsIN.prototype = new GCodeBase();

// Display name shown in user interface:
BuildBoticsIN.displayName = "BuildBotics[in]";

/**
 * Write tool list in header.
 */
BuildBoticsIN.prototype.writeHeader = function() {
    this.writeBlock("header");

    // backup member variables:
    var tool = this.tool;
    var toolDiameter = this.toolDiameter;
    var toolRadius = this.toolRadius;

    // write list of tools with tool radius
    var toolNames = Cam.getToolNames(this.cadDocument);
    toolNames.sort(Array.alphaNumericalSorter);
    //toolNames = RS.sortAlphanumerical(toolNames);
    for (var i=0; i<toolNames.length; i++) {
        var toolName = toolNames[i];

        // temporarily overwrite member variables:
        this.tool = toolName;
        this.toolDiameter = Cam.getToolDiameter(this.cadDocument, toolName, 0.0);
        this.toolRadius = this.toolDiameter/2;

        this.writeBlockFromString("[N] G10 L1 P[T#] R[TR#]");
    }

    // restore member variables:
    this.tool = tool;
    this.toolDiameter = toolDiameter;
    this.toolRadius = toolRadius;
};
