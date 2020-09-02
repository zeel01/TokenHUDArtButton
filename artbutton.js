class ShowArt {
	static getTokenActor(token) {
		return game.actors.get(token.actorId); 
	}
	static getTokenTitles(token, actor) {
		const	M = CONST.TOKEN_DISPLAY_MODES,
				dn = token.displayname;

		if (dn == M.ALWAYS || dn == M.HOVER) return {
			actor: token.actorData.name || actor.name,
			token: token.name,
		}

		const hiddenName = game.i18n.localize("DND5E.Name");
		return { actor: hiddenName, token: hiddenName }
	}
	static getTokenImages(token, actor) {
		const mystery = "icons/svg/mystery-man.svg";
		const synthActor = token.actorData;

		let actorImg = synthActor.img || actor.data.img;
		let tokenImg = token.img;

		let am = actorImg === mystery;
		let tm = tokenImg === mystery;

		if (!(am && tm)) {
			actorImg = am ? tokenImg : actorImg;
			tokenImg = tm ? actorImg : tokenImg;
		}

		return { actor: actorImg, token: tokenImg };
	}
	static createButton() {
		let button = document.createElement("div");

		button.classList.add("control-icon");
		button.classList.add("artwork-open");
		button.innerHTML = `<i class="fas fa-image fa-fw"></i>`
		button.title = game.i18n.localize("TKNHAB.TooltipText");

		return button;
	}
	static prepTileKeybinding(tile, control) {
		const doc = $(document);
		doc.off("keydown.showArt");
		if (!control) return;

		doc.on("keydown.showArt", (event) =>
			this.keyEventHandler(event, tile.data.img, game.i18n.localize("TKNHAB.TileImage"))
		);
	}
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
	static keyEventHandler(event, image, title) {
		if (event.shiftKey && (event.key == "Z" || event.key == "X")) {
			const pop = this.createImagePopup(image, title);
			if (!event.altKey && game.user.isGM) pop.shareImage();
		}
	}
	static buttonEventHandler(even, image, title) {
		const pop = this.createImagePopup(image, title);
		if (event.shiftKey && game.user.isGM) pop.shareImage();
	}
	static createImagePopup(image, title) {
		return new ImagePopout(image, {
			title, shareable: true,
		}).render(true);
	}
}


Hooks.on("controlTile", (...args) => ShowArt.prepTileKeybinding(...args));
Hooks.on("controlToken", (...args) => ShowArt.prepTokenKeybinding(...args));

Hooks.on("renderTileHUD", (...args) => ShowArt.prepTileHUD(...args));
Hooks.on("renderTokenHUD", (...args) => ShowArt.prepTokenHUD(...args));