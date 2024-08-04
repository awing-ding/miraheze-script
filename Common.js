( function () {
	/*
	 Tout JavaScript présent ici sera exécuté par tous les utilisateurs à chaque chargement de page.
	*/
	var hooks = [];
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

	function colorBandeau( content, mode ) {
		var classSelec;
		var dataName;
		if ( mode === 'dark' ) {
			classSelec = '.darkmode-data';
			dataName = 'darkmode';
		} else {
			classSelec = '.whitemode-data';
			dataName = 'whitemode';
		}
		content.find( classSelec ).each( function () {
			var $bandeau = $( this ).siblings( '.bandeau-generique' ).first();
			var newColor = $( this ).data( dataName + '-color' );
			if ( newColor !== 'null' ) {
				$bandeau.css( 'color', newColor );
			}
			var newBgColor = $( this ).data( dataName + '-bg-color' );
			if ( newBgColor !== 'null' ) {
				$bandeau.css( 'background-color', newBgColor );
			}
			var newBorderColor = $( this ).data( dataName + '-border-color' );
			if ( newBorderColor !== 'null' ) {
				$bandeau.css( 'border-color', newBorderColor );
			}
		} );
	}

	function actOnBackground( content ) {
		var checkIsDarkSchemePreferred = window.matchMedia && window.matchMedia( '(prefers-color-scheme:dark)' ).matches;
		// eslint-disable-next-line no-jquery/no-global-selector
		var citizenSkinTheme = $( 'html' ).attr( 'class' ).split( ' ' ).filter( function ( c ) {
			return c === 'skin-citizen-dark' || c === 'skin-citizen-light' || c === 'skin-citizen-auto';
		} )[ 0 ];
		if ( ( checkIsDarkSchemePreferred && citizenSkinTheme === 'skin-citizen-auto' ) || citizenSkinTheme === 'skin-citizen-dark' ) {
			colorBandeau( content, 'dark' );
		} else {
			colorBandeau( content, 'light' );
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

	/* ///////////////////////////////////////////////////// */
	/*                      Listener                         */
	/* ///////////////////////////////////////////////////// */
	// listen if html class change (dark/light mode switch)
	var observer = new MutationObserver( function ( mutations ) {
		mutations.forEach( function ( mutation ) {
			if ( mutation.attributeName === 'class' ) {
				// eslint-disable-next-line no-jquery/no-global-selector
		        actOnBackground( $( '.mw-parser-output' ) );
			}
		} );
	} );
	observer.observe( document.querySelector( 'html' ), {
		attributes: true
	} );

}() );
