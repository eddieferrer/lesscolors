if (Meteor.isClient) {

    Template.colorinput.maincolorHUE = function () {
        return Session.get('maincolorHUE');
    };
    Template.colorinput.maincolorSAT = function () {
        return Session.get('maincolorSAT');
    };
    Template.colorinput.maincolorLIGHT = function () {
        return Session.get('maincolorLIGHT');
    };
    Template.colorinput.maincolorHEX = function () {
        return Session.get('maincolorHEX');
    };
    Template.colorinput.lesscode = function () {
        return Session.get('lesscode');
    };
    Template.colorinput.rendered = function() {
        $('#goDark').on('click', function(event){
            $('div#wrap').addClass('dark');
        });
        $('#goLight').on('click', function(event){
            $('div#wrap').removeClass('dark');
        });        

        $('#hueSlider').slider({ 
            min: 0,
            max: 360,
            step: 1,
            slide: function( event, ui ) {
                Session.set('maincolorHUE', ui.value );

                var rgb = hslToRgb(Session.get('maincolorHUE'), Session.get('maincolorSAT'), Session.get('maincolorLIGHT') );
                Session.set('maincolorHEX', rgb2hex(rgb[0], rgb[1], rgb[2]));
                $('#colorinput').attr('value', Session.get('maincolorHEX'));
                console.log($('#hueSlider').slider( "value" ));
                
                outputLessCode();              
            }
        });
        $('#satSlider').slider({ 
            min: 0,
            max: 100,
            step: 1,
            slide: function( event, ui ) {
                Session.set('maincolorSAT', ui.value );

                var rgb = hslToRgb(Session.get('maincolorHUE'), Session.get('maincolorSAT'), Session.get('maincolorLIGHT') );
                Session.set('maincolorHEX', rgb2hex(rgb[0], rgb[1], rgb[2]));
                $('#colorinput').attr('value', Session.get('maincolorHEX'));
                console.log($('#satSlider').slider( "value" ));
                
                outputLessCode();
            }
        });
        $('#lightSlider').slider({ 
            min: 0,
            max: 100,
            step: 1,
            slide: function( event, ui ) {
                Session.set('maincolorLIGHT', ui.value );

                var rgb = hslToRgb(Session.get('maincolorHUE'), Session.get('maincolorSAT'), Session.get('maincolorLIGHT') );
                Session.set('maincolorHEX', rgb2hex(rgb[0], rgb[1], rgb[2]));
                $('#colorinput').attr('value', Session.get('maincolorHEX'));
                console.log($('#lightSlider').slider( "value" ));

                outputLessCode();
            }
        });

        //initialize color app with random color
        if ( !(Session.get('maincolorHEX')) ) { 
            $('#hueSlider').slider( "value", Math.floor((Math.random()*360)+1) );
            $('#satSlider').slider( "value", Math.floor((Math.random()*100)+1) );
            $('#lightSlider').slider( "value", Math.floor((Math.random()*100)+1) );
            Session.set('maincolorHUE', $('#hueSlider').slider( "value" ) );
            Session.set('maincolorSAT', $('#satSlider').slider( "value" ) );
            Session.set('maincolorLIGHT', $('#lightSlider').slider( "value" ) );
            var rgb = hslToRgb(Session.get('maincolorHUE'), Session.get('maincolorSAT'), Session.get('maincolorLIGHT') );
            Session.set('maincolorHEX', rgb2hex(rgb[0], rgb[1], rgb[2]));
        }
    };

    Template.colorinput.events = {
        'keyup #colorinput' : function (event) {
            Session.set('maincolorHEX', event.currentTarget.value);
            if ( Session.get('maincolorHEX').length == 6 ) {
                var rgbred = hexToR(Session.get('maincolorHEX'));
                var rgbgreen = hexToG(Session.get('maincolorHEX'));
                var rgbblue = hexToB(Session.get('maincolorHEX'));
                var hslcolor = rgbToHsl(rgbred, rgbgreen, rgbblue);
                console.log(hslcolor);
                Session.set('maincolorHUE', hslcolor[0]);
                Session.set('maincolorSAT', hslcolor[1]);
                Session.set('maincolorLIGHT', hslcolor[2]);

                $( "#hueSlider" ).slider( "option", "value", hslcolor[0] );
                $( "#satSlider" ).slider( "option", "value", hslcolor[1] );
                $( "#lightSlider" ).slider( "option", "value", hslcolor[2] );

                outputLessCode();
            }
            console.log( Session.get('maincolorHEX') );
        },
        'change #colorscheme' : function (event) {
            $.cssHooks.backgroundColor = {
                get: function(elem) {
                    if (elem.currentStyle)
                        var bg = elem.currentStyle["backgroundColor"];
                    else if (window.getComputedStyle)
                        var bg = document.defaultView.getComputedStyle(elem,
                            null).getPropertyValue("background-color");
                    if (bg.search("rgb") == -1)
                        return bg;
                    else {
                        bg = bg.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                        function hex(x) {
                            return ("0" + parseInt(x).toString(16)).slice(-2);
                        }
                        return "#" + hex(bg[1]) + hex(bg[2]) + hex(bg[3]);
                    }
                }
            }              
            outputLessCode();
        }
    };
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}

var lightordark;
var saturation
function outputLessCode() { 

    if (Session.get('maincolorLIGHT') > 50){
        lightordark = 'darken';
    }
    if (Session.get('maincolorLIGHT') <= 50){
        lightordark = 'lighten';
    }
    if (Session.get('maincolorSAT') > 50){
        saturation = 'desaturate';
    }
    if (Session.get('maincolorSAT') <= 50){
        saturation = 'saturate';
    }

    if ( $('#colorscheme').val() == "none" ) {
        console.log('none');
        $('.lesscode_area').text('@basecolor: #'+Session.get('maincolorHEX')+';\n');
        $('.color_row').hide();
    }
    if ( $('#colorscheme').val() == "triad" ) {
        console.log('triad');
        $('.color_row').hide();
        $('.color_row.triad').show();
        $('.lesscode_area').text('/* Triad Colors */'+'\n');
        $('.lesscode_area').append('@basecolor: #'+Session.get('maincolorHEX')+';\n');
        $('.lesscode_area').append('@color1: spin(@basecolor, -120);\n');
        $('.lesscode_area').append('@color2: '+lightordark+'(spin(@basecolor, -120),20);\n');
        $('.lesscode_area').append('@color3: spin(@basecolor, 120);\n');
        $('.lesscode_area').append('@color4: '+lightordark+'(@basecolor,20);\n');

        less.Override('@triad1', lightordark+'(spin(#'+Session.get('maincolorHEX')+', -120), 20)');
        less.Override('@triad2', 'spin(#'+Session.get('maincolorHEX')+', -120)');
        less.Override('@triad3', 'spin(#'+Session.get('maincolorHEX')+', 120)');
        less.Override('@triad4', lightordark+'(#'+Session.get('maincolorHEX')+', 20)');
    }
    if ( $('#colorscheme').val() == "complementary" ) {
        console.log('complementary');
        $('.color_row').hide();
        $('.color_row.complementary').show();
        $('.lesscode_area').text('/* Complementary Colors */'+'\n');
        $('.lesscode_area').append('@basecolor: #'+Session.get('maincolorHEX')+';\n');
        $('.lesscode_area').append('@color1: spin(@basecolor, 180);\n');
        $('.lesscode_area').append('@color2: '+lightordark+'(spin(@basecolor, 180), 30);\n');
        $('.lesscode_area').append('@color3: '+saturation+'(@basecolor, 20);\n');
        $('.lesscode_area').append('@color4: '+lightordark+'(@basecolor, 30);\n');

        less.Override('@complementary1', 'spin(#'+Session.get('maincolorHEX')+', 180)');
        less.Override('@complementary2', lightordark+'(spin(#'+Session.get('maincolorHEX')+', 180), 30)');
        less.Override('@complementary3', saturation+'(#'+Session.get('maincolorHEX')+', 20)');
        less.Override('@complementary4', lightordark+'(#'+Session.get('maincolorHEX')+', 30)');
    }
    if ( $('#colorscheme').val() == "monochromatic" ) {
        console.log('monochromatic');
        $('.color_row').hide();
        $('.color_row.mono').show();
        $('.lesscode_area').text('/* Monochromatic Colors */'+'\n');
        $('.lesscode_area').append('@basecolor: #'+Session.get('maincolorHEX')+';\n');
        $('.lesscode_area').append('@color1: '+lightordark+'(@basecolor, 50);\n');
        $('.lesscode_area').append('@color2: '+lightordark+'(@basecolor, 20);\n');
        $('.lesscode_area').append('@color3: '+saturation+'(@basecolor, 30);\n');
        $('.lesscode_area').append('@color4: '+lightordark+'('+saturation+'(@basecolor, 30), 50);\n');

        less.Override('@mono1', lightordark+'(#'+Session.get('maincolorHEX')+', 50)');
        less.Override('@mono2', lightordark+'(#'+Session.get('maincolorHEX')+', 20)');
        less.Override('@mono3', saturation+'(#'+Session.get('maincolorHEX')+', 30)');
        less.Override('@mono4', saturation+'('+lightordark+'(#'+Session.get('maincolorHEX')+', 30), 30)');   
    }
    if ( $('#colorscheme').val() == "analogous" ) {
        console.log('analogous');
        $('.color_row').hide();
        $('.color_row.analogous').show();
        $('.lesscode_area').text('/* Analogous Colors */'+'\n');
        $('.lesscode_area').append('@basecolor: #'+Session.get('maincolorHEX')+';\n');
        $('.lesscode_area').append('@color1: spin(@basecolor, 30);\n');
        $('.lesscode_area').append('@color2: spin(@basecolor, 15);\n');
        $('.lesscode_area').append('@color3: spin(@basecolor, -15);\n');
        $('.lesscode_area').append('@color4: spin(@basecolor, -30);\n');

        less.Override('@analogous1', 'spin(#'+Session.get('maincolorHEX')+', 30)');
        less.Override('@analogous2', 'spin(#'+Session.get('maincolorHEX')+', 15)');
        less.Override('@analogous3', 'spin(#'+Session.get('maincolorHEX')+', -15)');
        less.Override('@analogous4', 'spin(#'+Session.get('maincolorHEX')+', -30)');        
    } 

    $('div.color_cell').each( function(){
        $(this).find('span').text($(this).css('backgroundColor')); 
    });
}

function hueShift(h,s) { 
    h+=s; 
    while (h>=360.0) h-=360.0; 
    while (h<0.0) h+=360.0; return h; 
}

////////////////////////////////////////
// BELOW ARE COLOR CONVERSION FUNCTIONS
////////////////////////////////////////

//function to convert hex to parts of RGB
function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}


//Function to convert hex format to a rgb color
function rgb2hex(r, g, b) {
    return hex(r) + hex(g) + hex(b);
}

function hex(x) {
    var hexDigits = new Array
        ("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"); 
    return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
}

//Function to convert hsl format to a rgb color
function hslToRgb (h, s, l) {
    var r, g, b, m, c, x
    if (!isFinite(h)) h = 0
    if (!isFinite(s)) s = 0
    if (!isFinite(l)) l = 0
    h /= 60
    if (h < 0) h = 6 - (-h % 6)
    h %= 6
    s = Math.max(0, Math.min(1, s / 100))
    l = Math.max(0, Math.min(1, l / 100))
    c = (1 - Math.abs((2 * l) - 1)) * s
    x = c * (1 - Math.abs((h % 2) - 1))
    if (h < 1) {
        r = c
        g = x
        b = 0
    } else if (h < 2) {
        r = x
        g = c
        b = 0
    } else if (h < 3) {
        r = 0
        g = c
        b = x
    } else if (h < 4) {
        r = 0
        g = x
        b = c
    } else if (h < 5) {
        r = x
        g = 0
        b = c
    } else {
        r = c
        g = 0
        b = x
    }

    m = l - c / 2
    r = Math.round((r + m) * 255)
    g = Math.round((g + m) * 255)
    b = Math.round((b + m) * 255)

    return [r, g, b]
}

//Function to convert rgb format to a hsl color
function rgbToHsl (r, g, b) {
    var max, min, h, s, l, d
    r /= 255
    g /= 255
    b /= 255
    max = Math.max(r, g, b)
    min = Math.min(r, g, b)
    l = (max + min) / 2
    if (max == min) {
        h = s = 0
    } else {
        d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0)
                break
            case g:
                h = (b - r) / d + 2
                break
            case b:
                h = (r - g) / d + 4
                break
        }
        h /= 6
    }
    
    h = Math.floor(h * 360)
    s = Math.floor(s * 100)
    l = Math.floor(l * 100)
 
    return [h, s, l]
}
