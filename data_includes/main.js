PennController.ResetPrefix(null);                       // Initiates PennController
PennController.DebugOff()
var showProgressBar = false;                            // Don't show progress bar

////////////////////////////////////////////////////////////////////////////////

// Custom button: creates button with blue background
customButton = text  => 
    newButton(text)
        .center()
        .css({"background-color":"lightblue"})
        .print()
        .wait()

////////////////////////////////////////////////////////////////////////////////

// Running order

// Separates items into blocks of [n] trials and adds newTrial("break") in between each block
// source: https://github.com/addrummond/ibex/blob/master/docs/manual.md#modifying-the-running-order-manually
// function modifyRunningOrder(ro) {
// 	var n = 8 ;
//     for (var i = 0; i < ro.length; ++i) {
//         if (i % n == (n-1)) {
//             // Passing 'true' as the third argument casues the results from this controller to be omitted from the results file. 
//             ro[i].push(new DynamicElement(
//     			"PennController",
// 				newTrial("break",
// 					newVar("score").global()
//     				,
//     				newVar("outOf").global()
//     				,
// 					defaultText
// 						.center()
// 					,
//     				newText("pt1", "Time for a longer break!")
//     					.cssContainer({"margin":"145px 0 0 0", "width":"600px", "font-size":"150%"})
//     					.bold()
//     					.print()
//     				,
//     				newText("pt2", "Press the spacebar to see comprehension question accuracy.")
//     					.cssContainer({"margin":"105px 0 0 0", "width":"600px"})
// 						.italic()
// 						.print()
// 					,
// 					newKey(" ")
// 						.wait()
// 					,
// 					getText("pt1").remove()
// 					,
// 					getText("pt2").remove()
//     				,
//     				// Prints comprehension question accuracy as fraction
// 					newText("accuracy", "Current comprehension question accuracy: ")
// 						.cssContainer({"margin":"145px 0 0 0", "width":"600px"})
//     					.after(newText("").text(getVar("score")))
//   						.after(newText("/"))
//     					.after(newText("").text(getVar("outOf")))
//     					.print()
// 					,
// 					customButton("Click here to continue")
// 						.cssContainer({"margin":"50px 0 0 0", "width":"600px"})
// 					,
// 					// reset [score] and [outOf] variables to 0
// 					getVar("score").set(v=>0)
// 					,
// 					getVar("outOf").set(v=>0)
// 				)
//     			,
//     			false
// 			));
//         }
//     }
//     return ro;
// }

// Testing sequences  
// Sequence(rshuffle("test_vpe", "test_good-fillers", "test_bad-fillers"), "end", "send")

function SepWithN(sep, main, n) {
    this.args = [sep,main];

    this.run = function(arrays) {
        assert(arrays.length == 2, "Wrong number of arguments (or bad argument) to SepWithN");
        assert(parseInt(n) > 0, "N must be a positive number");
        let sep = arrays[0];
        let main = arrays[1];

        if (main.length <= 1)
            return main
        else {
            let newArray = [];
            while (main.length){
                for (let i = 0; i < n && main.length>0; i++)
                    newArray.push(main.pop());
                for (let j = 0; j < sep.length; ++j)
                    newArray.push(sep[j]);
            }
            return newArray;
        }
    }
}
function sepWithN(sep, main, n) { return new SepWithN(sep, main, n); }

// Actual sequence
Sequence("welcome", "practice", "post-practice", sepWithN("break", rshuffle("test_vpe", "test_good-fillers", "test_bad-fillers"), 5), "end", "send", "confirmation")

////////////////////////////////////////////////////////////////////////////////

// Experiment

// Welcome/instructions
newTrial("welcome",
    newHtml("welcome", "welcome.html")
        .settings.cssContainer({"width": "720px"})
        .print()
    ,
    newText("next", "Press the spacebar to continue.")
        .italic()
        .center()
        .print()
    ,
    newKey(" ")
        .wait()
    ,
    clear()
    ,
    newHtml("instructions", "instructions.html")
        .settings.cssContainer({"width": "720px"})
        .print()
    ,
    customButton("Click here to continue")
)

// Post-practice items
newTrial("post-practice",
    newHtml("post-practice", "post-practice.html")
        .settings.cssContainer({"width": "600px"})
        .print()
    ,
    customButton("Click here to start the experiment")
)

// Break Trial				
newTrial("break",
	newVar("score").global()
	,
	newVar("outOf").global()
	,
	defaultText
		.center()
	,
	newText("pt1", "Time for a longer break!")
		.cssContainer({"margin":"145px 0 0 0", "width":"600px", "font-size":"150%"})
		.bold()
		.print()
	,
	newText("pt2", "Press the spacebar to see comprehension question accuracy.")
		.cssContainer({"margin":"105px 0 0 0", "width":"600px"})
		.italic()
		.print()
	,
	newKey(" ")
		.wait()
	,
	getText("pt1").remove()
	,
	getText("pt2").remove()
	,
	// Prints comprehension question accuracy as fraction
	newText("accuracy", "Current comprehension question accuracy: ")
		.cssContainer({"margin":"145px 0 0 0", "width":"600px"})
		.after(newText("").text(getVar("score")))
   		.after(newText("/"))
		.after(newText("").text(getVar("outOf")))
		.print()
	,
	customButton("Click here to continue")
		.cssContainer({"margin":"50px 0 0 0", "width":"600px"})
	,
	// reset [score] and [outOf] variables to 0
	getVar("score").set(v=>0)
	,
	getVar("outOf").set(v=>0)
)

// Trial template
	// source CSV must have the following columns: [sentence]
	// source CSV can have the following columns: [question], [F_answer], [J_answer], [feedback] 
	// source CSV should have the following columns (for logging): [group], [condition], [item], [correct_judgment], [correct_answer]
customTrial = label => variable => newTrial( label ,
	// create [score] and [outOf] variables and initialize to 0 if they do not already exist
	newVar("score", 0).global()
	,
	newVar("outOf", 0).global()
	,
	// Set text to always be centered
    defaultText
        .center()
    ,
    // Rest screen in between trials (press space to continue)
    newImage("fixation_cross", "fixation_cross.png")
        .size(300,300)
    ,
    newCanvas(300, 310)
        .add(0, 10, getImage("fixation_cross"))
        .print()
    ,
    newKey("continue", " ")
        .wait()
    ,
    clear()
    ,
    // RSVP sentence
    	// margin: top=110px right=0px bottom=0px left=0px
    newController("dash", "DashedSentence", {s:variable.sentence, "mode":"speeded acceptability", "display":"in place", "wordTime":200})
        .cssContainer({"margin":"110px 0 0 0", "font-size": "150%",})
        .log()
        .print()
        .wait()
        .remove()
    ,
    // Grammaticality Judgment
    newText("placeholder", "+++++++")
    .cssContainer({"width": "600px", "height": "50px","font-size": "150%"})
    ,
    // F for not okay, J for okay
    newText("not_okay", "F)&nbsp; NOT OKAY")
        .italic()
        .cssContainer({"width": "300px"})
    ,
    newText("okay", "J)&nbsp; OKAY")
        .italic()
        .cssContainer({"width": "300px"})
    ,
    newCanvas("j_display", 600, 400)
        .add(0, 145, getText("placeholder"))
        .add(0, 350, getText("not_okay"))
        .add(300, 350, getText("okay"))
        .print()
        .log()
    ,
    // Speeded judgment:  If participant presses F/J key while timer is still running, continue. Otherwise, display newText("tooSlow")
    // Set timer to [3000]ms
    newTimer("window", 3000)
    	.log()
        .start()
    ,
    newKey("judgment", "FJ")
    	.log()
    	.wait()
    ,
    // margin: top=145px right=0px bottom=0px left=0px
    newText("tooSlow", "Too slow...")
		.cssContainer({"margin":"145px 0 0 0", "width":"600px"})
    ,
    // margin: top=105px right=0px bottom=0px left=0px
    // Displayed at 350px height if printed under element with 145px top margin
    newText("next", "Press the spacebar to continue.")
    	.italic()
    	.cssContainer({"margin":"105px 0 0 0", "width":"600px"})
    ,
    clear()
	,
    getTimer("window")
    	.test.running()
    	.failure(
    		getText("tooSlow").print(),
    		getText("next").print(),
    		getKey("continue").wait(),
    		clear()
    	)
	,
    // Comprehension question (only displays if value in source CSV's [question] column is non-empty)
    (variable.question?[
    newText("question", variable.question)
        .cssContainer({"width": "600px", "height": "50px", "font-size": "150%"})
    ,
    newText("F_answer", variable.F_answer)
        .before(newText("F)&nbsp;"))
        .cssContainer({"width": "300px"})
    ,
    newText("J_answer", variable.J_answer)
        .before(newText("J)&nbsp;"))
        .cssContainer({"width": "300px"})
    ,
    newText("reminder", "Press the F or J key to select your answer")
        .italic()
        .cssContainer({"width": "600px"})
    ,
    newCanvas("q_display", 600, 400)
        .add(0, 145, getText("question"))
        .add(0, 200, getText("F_answer"))
        .add(300, 200, getText("J_answer"))
        .add(0, 350, getText("reminder"))
        .print()
        .log()
    ,
    newKey("answer", "FJ")
        .log()
        .callback(
			getKey("answer")
				.test.pressed(variable.correct_answer)
				// Increment [score] variable if question is answered correctly
				.success(getVar("score").set(v=>v+1))
			,
			// Increment [outOf] variable every time a question is answered
			getVar("outOf").set(v=>v+1)
		)
		.wait()
    ]:null)
    ,
    clear()
    // Feedback (only displays if value in source CSV's [feedback] column is non-empty)
    ,
    (variable.feedback?[
    newText(variable.feedback)
    	.bold()
		.cssContainer({"margin":"145px 0 0 0", "width":"600px"})
		.print()
	,
	getText("next").print()
	,
    getKey("continue").wait()
    ]:null)
)
.log("group",               	variable.group)
.log("condition",           	variable.condition)
.log("item",                	variable.item)
.log("correct_judgment",    	variable.correct_judgment)
.log("correct_answer",    	    variable.correct_answer)
.log("score",    	    		getVar("score"))
.log("outOf",    	    		getVar("outOf"))

// Items
Template("practice.csv",            customTrial("practice"))
Template("test_bad-fillers.csv",    customTrial("test_bad-fillers"))
Template("test_good-fillers.csv",   customTrial("test_good-fillers"))
Template("test_vpe.csv",            customTrial("test_vpe"))


// Post-experiment comment section
newTrial("end",
	newHtml("comments", "comments.html")
		.log()
		.settings.cssContainer({"width": "720px"})
		.print()
	,
    customButton("Click here to continue")
    ,
    clear()
    ,
    newHtml("exit_form", "exit.html")
        .log()
        .settings.cssContainer({"width": "720px"})
        .inputWarning("Please enter your name and create a unique identifier.")
        .print()
    ,
    newButton("Click here to finish the experiment.")
        .css({"background-color":"lightblue", "font-size": "150%", "font-weight": "bold"})
        .size(500,50)
        .center()
        .print()
        .wait(
            getHtml("exit_form").test.complete()
            .failure(getHtml("exit_form").warn() )
        )
)

// Send results
PennController.SendResults("send");

// End-of-experiment confirmation
newTrial("confirmation",
    newText("Thank you for participating! You may now exit the window.")
        .center()
        .print()
    ,
    newButton("void")
        .wait()
)
