export function telHref(/** @type {string} */ mobile) {
	return 'tel:' + mobile.replaceAll(' ', '')
}
