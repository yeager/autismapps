import test from 'node:test';
import assert from 'node:assert/strict';
import { PRIVACY_POLICIES } from '../../src/lib/data/privacy-policy.ts';

const locales = ['en', 'sv', 'pt_BR'];
const requiredLinks = [
	'https://arasaac.org/privacy-policy',
	'https://teckensprakslexikon.su.se',
	'https://www.spreadthesign.com',
	'https://huggingface.co/privacy'
];

test('privacy policy has localized content and working contact details for every ready locale', () => {
	for (const locale of locales) {
		const policy = PRIVACY_POLICIES[locale];
		assert.ok(policy.title, `${locale}: missing title`);
		assert.ok(policy.intro, `${locale}: missing introduction`);
		assert.equal(policy.contact.email, 'daniel@danielnylander.se');
		assert.ok(policy.sections.length >= 6, `${locale}: missing policy sections`);
		const content = JSON.stringify(policy);
		for (const link of requiredLinks) assert.ok(content.includes(link), `${locale}: missing ${link}`);
		assert.doesNotMatch(content, /jsDelivr/i, `${locale}: lists a service not used by the active site`);
		assert.match(content, /selected word|valt ord|palavra selecionada/i, `${locale}: does not explain that the sign search term is sent externally`);
		assert.match(content, /localStorage/);
		assert.match(content, /Hugging Face/);
	}
});
