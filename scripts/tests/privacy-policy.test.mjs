import test from 'node:test';
import assert from 'node:assert/strict';
import { PRIVACY_POLICIES } from '../../src/lib/data/privacy-policy.ts';

const locales = ['en', 'sv', 'pt_BR'];
const requiredLinks = [
	'https://arasaac.org/privacy-policy',
	'https://teckensprakslexikon.su.se',
	'https://huggingface.co/privacy',
	'https://www.jsdelivr.com/terms/privacy-policy-jsdelivr-net'
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
		assert.match(content, /localStorage/);
		assert.match(content, /Hugging Face/);
	}
});
