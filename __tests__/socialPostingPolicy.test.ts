import { validateSocialPost, PostingPlatform } from '@/lib/safety/socialPostingPolicy';

describe('Social Posting Policy — approval gate', () => {
  it('always requires human approval, regardless of content', () => {
    const { requiresHumanApproval } = validateSocialPost('A completely ordinary, safe post.', 'twitter');
    expect(requiresHumanApproval).toBe(true);
  });

  it('never returns requiresHumanApproval: false for any platform', () => {
    const platforms: PostingPlatform[] = ['twitter', 'linkedin', 'instagram', 'mastodon', 'bluesky'];
    for (const platform of platforms) {
      const { requiresHumanApproval } = validateSocialPost('Any content at all.', platform);
      expect(requiresHumanApproval).toBe(true);
    }
  });

  it('flags forbidden content: direct donation asks', () => {
    const { safe, violations } = validateSocialPost('Donate now to help us!', 'twitter');
    expect(safe).toBe(false);
    expect(violations.length).toBeGreaterThan(0);
  });

  it('flags forbidden content: guarantee claims', () => {
    const { safe, violations } = validateSocialPost('This is a guaranteed outcome.', 'twitter');
    expect(safe).toBe(false);
    expect(violations.some(v => v.includes('guarantee'))).toBe(true);
  });

  it('flags content exceeding platform character limits', () => {
    const longContent = 'a'.repeat(300);
    const { safe, violations } = validateSocialPost(longContent, 'twitter');
    expect(safe).toBe(false);
    expect(violations.some(v => v.includes('character limit'))).toBe(true);
  });

  it('allows clean, within-limit content with no forbidden patterns', () => {
    const { safe, violations } = validateSocialPost('Grant Scout completed research this week.', 'twitter');
    expect(safe).toBe(true);
    expect(violations.length).toBe(0);
  });
});

/**
 * Scope note: this suite tests the one piece of the repo's codebase that
 * actually enforces a human-approval gate before publishing (social posts).
 * It does not — and cannot — test the Founder External-Contact Rule
 * (MISSION_PROTOCOL_v0.1 §9b: SEND/CONTACT is Bambu-only, not just
 * human-approved) because this repository has no live external-send
 * mechanism (email, SMS, call) for that rule to gate. The rule is
 * DOCUMENTED (canonical in the protocol) and this repo's existing
 * approval-gate code is a real, tested precedent for "no autonomous
 * publish" — but the founder-specific distinction has no corresponding
 * executable code path yet. See openspec/public-proof/ for the closeout
 * audit that states this explicitly.
 */
