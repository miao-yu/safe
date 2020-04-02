import XEducationSlide from './x-education-slide.js';

export default class XEducationSlidePhishers extends XEducationSlide {
    html() {
        return `
            <h1 class="modal-header">
                How To Protect Yourself from Phishers
                <i x-modal-close class="material-icons">close</i>
            </h1>
            <div class="modal-body">
                <h3>Phishers send you a message with a link to a website that looks just like the Nimiq Safe, Paypal, or your bank, but is not the real website. They steal your information and then steal your money.</h3>
                <div class="has-side-image">
                    <ul>
                        <li>Always validate the URL: https://safe.nimiqchina.com</li>
                        <li><strong>The only authorized view that will ever ask you for your Password, Login File or 24 Recovery Words is the Nimiq Keyguard at https://keyguard.nimiqchina.com</strong></li>
                        <!-- <li>Always make sure the URL bar has NIMIQ in green</li> -->
                        <li>Do not trust messages or links sent to you randomly via email, Slack, Reddit, Twitter, etc.
Always navigate directly to a site before you enter information. Do not enter information after clicking a link from a message or email.</li>
                        <li>Consider installing an AdBlocker and do not click ads on your search engine (e.g. Google).</li>
                    </ul>
                    <div class="side-image-phishers"></div>
                </div>

                <div class="button-bar">
                    <button back>What's the point?</button>
                    <button next>Protect from Scams</button>
                </div>
            </div>
        `;
    }
}
