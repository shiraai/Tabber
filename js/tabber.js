(function($) {
	$.fn.tabber = function() {
		return this.each(function() {
			// create tabs
			var $this = $(this),
				tabContent = $this.children('.tabbertab'),
				nav = $('<ul>').addClass('tabbernav'),
				loc;

			tabContent.each(function() {
				$(this).attr('data-hash', mw.util.escapeIdForAttribute(this.title));
				var anchor = $('<a>').text(this.title).attr('title',this.title).attr('data-hash', $(this).attr('data-hash')).attr('href', '#');
				$('<li>').append(anchor).appendTo(nav);

				// Append a manual word break point after each tab
				nav.append($('<wbr>'));
			});

			$this.prepend(nav);

			/**
			 * Internal helper function for showing content
			 * @param  {string} title to show, matching only 1 tab
			 *  Accepts only fully encoded titles (e.g. "Extreme.2B_.28Titan.29" for "Extreme+ (Titan)")
			 * @return {bool} true if matching tab could be shown
			 */
			function showContent(title) {
				var content = tabContent.filter('[data-hash="' + title + '"]');
				if (content.length !== 1) { return false; }
				tabContent.hide();
				content.show();
				nav.find('.tabberactive').removeClass('tabberactive');
				nav.find('a[data-hash="' + title + '"]').parent().addClass('tabberactive');
				return true;
			}

			/**
			 * Wrapper function for showContent that additionally
			 * shows the tabber content into view
			 */
			function showContentScroll(title) {
				var retval = showContent(title);
				if (retval) {
					var element = document.querySelector(`[data-hash="${title}"]`);
					element.scrollIntoView();
				}

				return retval;
			}

			// setup initial state
			var tab = new mw.Uri(location.href).fragment;
			if (tab === '' || !showContent(tab)) {
				showContent(tabContent.first().attr('data-hash'));
			} else {
				showContentScroll(tab);
			}

			// Respond to clicks on the nav tabs
			nav.on('click', 'a', function(e) {
				var title = $(this).attr('data-hash');
				e.preventDefault();
				if (history.replaceState) {
					history.replaceState(null, null, '#' + title);
					switchTab();
				} else if (history.pushState) {
					history.pushState(null, null, '#' + title);
					switchTab();
				} else {
					location.hash = '#' + title;
				}
			});

			$(window).on('hashchange', function(event) {
				switchTab();
			});

			function switchTab() {
				var tab = new mw.Uri(location.href).fragment;
				if (!tab.length) {
					showContent(tabContent.first().attr('data-hash'));
				}
				if (nav.find('a[data-hash="'+tab+'"]').length) {
					showContent(tab);
				}
			}

			$this.addClass('tabberlive');

			$(window).bind('hashchange', function(e) {
				var loc = location.hash.replace('#', '');
				if ( loc == '' ) {
					showContent(tabContent.first().attr('title'));
				}
				else {
					showContentScroll(loc);
				}
			});
		});
	};
}(jQuery));

$(document).ready(function() {
	$('.tabber').tabber();
});
