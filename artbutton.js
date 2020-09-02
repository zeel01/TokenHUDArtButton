/**
 * This class is used as a namespace for Show Art
 * static methods. It has no constructor.
 *
 * @class ShowArt
 */
class ShowArt {
	/**
	 * Handles the keydown events for tile and token keybindings
	 *
	 * @static
	 * @param {Event} event - The triggering event.
	 * @param {string} image - The file path of the image to display.
	 * @param {string} title - The name to display in the popup title bar.
	 * @memberof ShowArt
	 */
	static keyEventHandler(event, image, title) {
		if (event.shiftKey && (event.key == "Z" || event.key == "X")) {
			const pop = this.createImagePopup(image, title);
			if (!event.altKey && game.user.isGM) pop.shareImage();
		}
	}
	/**
	 * Handles the click or contextmenu events for tile/token art buttons
	 *
	 * @static
	 * @param {Event} event - The triggering event.
	 * @param {string} image - The file path of the image to display.
	 * @param {string} title - The name to display in the popup title bar.
	 * @memberof ShowArt
	 */
	static buttonEventHandler(event, image, title) {
		const pop = this.createImagePopup(image, title);
		if (event.shiftKey && game.user.isGM) pop.shareImage();
	}
	/**
	 * Creates and renders and ImagePopout
	 * with a specific image and title.
	 * the image is set to sharable.
	 *
	 * @static
	 * @param {string} image - The file path of the image to display.
	 * @param {string} title - The name to display in the popup title bar.
	 * @return {ImagePopout} The instance of the ImagePopout.
	 * @memberof ShowArt
	 */
	static createImagePopup(image, title) {
		return new ImagePopout(image, {
			title, shareable: true,
		}).render(true);
	}
	/**
	 * Retrieves the Actor associated with a given token.
	 *
	 * @static
	 * @param {Token} token - The Token to look for the Actor of.
	 * @return {Actor} The associated Actor.
	 * @memberof ShowArt
	 */
	static getTokenActor(token) {
		return game.actors.get(token.actorId); 
	}
	/**
	 * Determin the correct image titles for either the token,
	 * or the associated Actor.
	 *
	 * @static
	 * @param {Token} token - The Token to get the title of.
	 * @param {Actor} actor - The Actor to get the title of.
	 * @return {object} { actor, token } The titles for actor and token.
	 * @memberof ShowArt
	 */
	static getTokenTitles(token, actor) {
		const	M = CONST.TOKEN_DISPLAY_MODES,
				dn = token.displayName;

		if (dn == M.ALWAYS || dn == M.HOVER) return {
			actor: token.actorData.name || actor.name,
			token: token.name,
		}

		const hiddenName = game.i18n.localize("DND5E.Name");
		return { actor: hiddenName, token: hiddenName }
	}
	/**
 	 * Determin the correct image paths for either the token,
	 * or the associated Actor.
	 *
	 * @static
	 * @param {Token} token - The Token to get the path of.
	 * @param {Actor} actor - The Actor to get the path of.
	 * @return {object} { actor, token } The paths of the actor and token images. 
	 * @memberof ShowArt
	 */
	static getTokenImages(token, actor) {
		const mystery = "icons/svg/mystery-man.svg";
		const synthActor = token.actorData;

		let actorImg = synthActor.img || actor.data.img;
		let tokenImg = token.img;

		const am = actorImg === mystery;
		const tm = tokenImg === mystery;

		if (!(am && tm)) {
			actorImg = am ? tokenImg : actorImg;
			tokenImg = tm ? actorImg : tokenImg;
		}

		return { actor: actorImg, token: tokenImg };
	}
	/**
	 * Create the HTML elements for the HUD button
	 * including the Font Awesome icon and tooltop.
	 *
	 * @static
	 * @return {Element} The `<div>` element that is used as the HUD button.
	 * @memberof ShowArt
	 */
	static createButton() {
		let button = document.createElement("div");

		button.classList.add("control-icon");
		button.classList.add("artwork-open");
		button.innerHTML = `<i class="fas fa-image fa-fw"></i>`
		button.title = game.i18n.localize("TKNHAB.TooltipText");

		return button;
	}

	/**
	 * Adds the keybinding to the selected tile.
	 *
	 * @static
	 * @param {Tile} tile - The selected Tile.
	 * @param {Boolean} control - Whether or not this Tile is being selected, or deselected.
	 * @return {null} Early return if control is false.
	 * @memberof ShowArt
	 */
	static prepTileKeybinding(tile, control) {
		const doc = $(document);
		doc.off("keydown.showArt");
		if (!control) return;

		doc.on("keydown.showArt", (event) =>
			this.keyEventHandler(event, tile.data.img, game.i18n.localize("TKNHAB.TileImage"))
		);
	}
	/**
	 * Adds the keybinding to the selected token.
	 *
	 * @static
	 * @param {Token} token - The selected Token.
	 * @param {Boolean} control - Whether or not this Token is being selected, or deselected.
	 * @return {null} Early return if control is false.
	 * @memberof ShowArt
	 */
	static prepTokenKeybinding(token, control) {
		const doc = $(document);
		doc.off("keydown.showArt");
		if (!control) return;

		const actor = this.getTokenActor(token.data);
		const images = this.getTokenImages(token.data, actor);
		const titles = this.getTokenTitles(token.data, actor);

		doc.on("keydown.showArt", (event) =>
			this.keyEventHandler(
				event,
				event.key == "Z" ? images.token : images.actor,
				event.key == "Z" ? titles.token : titles.actor
			)
		);
	}
	/**
	 * Adds the button to the Token HUD,
	 * and attaches event listeners.
	 *
	 * @static
	 * @param {TokenHUD} hud - The HUD object, not used.
	 * @param {jQuery} html - The jQuery reference to the HUD HTML.
	 * @param {Token} token - The data for the Token.
	 * @memberof ShowArt
	 */
	static prepTokenHUD(hud, html, token) {
		const actor = this.getTokenActor(token);
		const images = this.getTokenImages(token, actor);
		const titles = this.getTokenTitles(token, actor);
		const artButton = this.createButton();

		$(artButton)
			.click((event) =>
				this.buttonEventHandler(event, images.actor, titles.actor)
			)
			.contextmenu((event) =>
				this.buttonEventHandler(event, images.token, titles.token)
			);

		html.find("div.left").append(artButton);
	}
	/**
	 * Adds the button to the Tile HUD,
	 * and attaches event listeners.
	 *
	 * @static
	 * @param {TileHUD} hud - The HUD object, not used.
	 * @param {jQuery} html - The jQuery reference to the HUD HTML.
	 * @param {Tile} token - The data for the Tile.
	 * @memberof ShowArt
	 */
	static prepTileHUD(hud, html, tile) {
		const artButton = this.createButton();

		$(artButton)
			.click((event) =>
				this.buttonEventHandler(
					event, tile.img,
					game.i18n.localize("TKNHAB.TileImage")
				)
			)
		html.find("div.left").append(artButton);
	}
}


Hooks.on("controlTile", (...args) => ShowArt.prepTileKeybinding(...args));
Hooks.on("controlToken", (...args) => ShowArt.prepTokenKeybinding(...args));

Hooks.on("renderTileHUD", (...args) => ShowArt.prepTileHUD(...args));
Hooks.on("renderTokenHUD", (...args) => ShowArt.prepTokenHUD(...args));