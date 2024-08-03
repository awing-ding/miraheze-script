( function () {
	/*
	 Tout JavaScript présent ici sera exécuté par tous les utilisateurs à chaque chargement de page.
	*/
	var hooks = [];
	var darkMode = [];
	var lightMode = [];
	/* ///////////////////////////////////////////////////// */
	/* Ajustement de la largeur des bandeaux d'information */
	/* ///////////////////////////////////////////////////// */

	function recalculateSize( content ) {
		var bandeaux = content.find( 'bandeau-generique' );
		bandeaux.each( function () {
			var $previousSibling = $( this ).prev();
			if ( $previousSibling ) {
				$( this ).css(
					'width',
					$previousSibling.offsetWidth -
          parseInt( $( this ).css( 'padding-left' ) ) -
          parseInt( $( this ).css( 'padding-right' ) ) +
          'px'
				);
			}
		} );
	}

	hooks.push( recalculateSize );

	/* ///////////////////////////////////////////////////// */
	/*             Gère la couleur des bandeaux            */
	/* ///////////////////////////////////////////////////// */

	function darkifyBandeau( content ) {
		var data = content.find( '.darkmode-data' );
		var bandeau = data.next();
		var darkColor = data.data( 'darkmode-color' );
		if ( darkColor !== 'null' ) {
			var whiteColor = bandeau.css( 'color' );
			bandeau.css( 'color', darkColor );
			data.data( 'whitemode-color', whiteColor );
		}
		var darkBgColor = data.data( 'darkmode-bg-color' );
		if ( darkBgColor !== 'null' ) {
			var whiteBgColor = bandeau.css( 'background-color' );
			bandeau.css( 'background-color', darkBgColor );
			data.data( 'whitemode-bg-color', whiteBgColor );
		}
		var darkBorderColor = data.data( 'darkmode-border-color' );
		if ( darkBorderColor !== 'null' ) {
			var whiteBorderColor = bandeau.css( 'border-color' );
			bandeau.css( 'border-color', darkBorderColor );
			data.data( 'whitemode-border-color', whiteBorderColor );
		}
		data.attr( 'class', '.whitemode-data' );
	}

	darkMode.push( darkifyBandeau );

	function clarifyBandeau( content ) {
		var data = content.find( '.whitemode-data' );
		var bandeau = data.next();
		var whiteColor = data.data( 'whitemode-color' );
		if ( whiteColor !== 'null' ) {
			var darkColor = bandeau.css( 'color' );
			bandeau.css( 'color', whiteColor );
			data.data( 'darkmode-color', darkColor );
		}
		var whiteBgColor = data.data( 'whitemode-bg-color' );
		if ( whiteBgColor !== 'null' ) {
			var darkBgColor = bandeau.css( 'background-color' );
			bandeau.css( 'background-color', whiteBgColor );
			data.data( 'darkmode-bg-color', darkBgColor );
		}
		var whiteBorderColor = data.data( 'whitemode-border-color' );
		if ( whiteBorderColor !== 'null' ) {
			var darkBorderColor = bandeau.css( 'border-color' );
			bandeau.css( 'border-color', whiteBorderColor );
			data.data( 'darkmode-border-color', darkBorderColor );
		}
		data.attr( 'class', '.darkmode-data' );
	}

	lightMode.push( clarifyBandeau );

	function actOnBackground( content ) {
		var checkIsDarkSchemePreferred = window.matchMedia && window.matchMedia( '(prefers-color-scheme:dark)' ).matches;
		if ( checkIsDarkSchemePreferred ) {
			darkMode.forEach( function ( hook ) {
				hook( content );
			} );
		} else {
			lightMode.forEach( function ( hook ) {
				hook( content );
			} );
		}
	}

	hooks.push( actOnBackground );

	/* ///////////////////////////////////////////////////// */
	/*                  lance les hooks                    */
	/* ///////////////////////////////////////////////////// */
	mw.hook( 'wikipage.content' ).add( function ( content ) {
		var pageContent;
		var parserOutput = content.find( '.mw-parser-output' );
		if ( parserOutput ) {
			pageContent = parserOutput;
		} else if ( parserOutput.hasClass( 'mw-parser-output' ) ) {
			pageContent = parserOutput;
		} else {
			return;
		}
		hooks.forEach( function ( hook ) {
			hook( pageContent );
		} );
	} );
}() );
