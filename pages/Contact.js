var Contact = {
    oninit: function () {
        scrollToTop();
    },
    view: function () {
        setTitle('Contact', true);

        return m.fragment({}, [
            m('div', { class: 'main-container' },
                m('div', { class: 'blog-body' }, [
                    m('h2', { class: 'blog-body-title' }, 'Contact Us'),
                    m('div', { class: 'blog-body-content bottom-divider' }, [
                        m("p", "Reach out to us"),
                        m("p", [m("strong", "General Inquiries")]),
                        m("p", "Questions or concerns such as technical issues or support can be sent to support@wonderfulsubs.com"),
                        m("p", [m("strong", "News Stories, Tips, or Press Releases")]),
                        m("p", "news@wonderfulsubs.com"),
                        m("p", [m("strong", "Office address")]),
                        m("p", ["WonderfulSubs LLC", m("br"), "Five Greentree Centre", m("br"), "525 Route 73 North, STE 104", m("br"), "Marlton,  NJ  08053"]),
                        m("p", [m("strong", "Phone number")]),
                        m("p", "You can reach us at 1 (856) 334-0286 (no text). Business inquires only."),
                        m("p", [m("strong", 'Digital Millennium Copyright Act ("DMCA") Inquiries')]),
                        m("p", "WonderfulSubs LLC respects the intellectual property rights of others. Per the DMCA, WonderfulSubs LLC will respond expeditiously to claims of copyright infringement on the Site if submitted to WonderfulSubs LLC's Copyright Agent as described below. Upon receipt of a notice alleging copyright infringement, WonderfulSubs LLC will take whatever action it deems appropriate within its sole discretion, including removal of the allegedly infringing materials and termination of access for repeat infringers of copyright protected content.", m("br"), "", m("br"), "If you believe that your intellectual property rights have been violated by WonderfulSubs LLC or by a third party who has uploaded materials to our website, please provide the following information to the designated Copyright Agent listed below:", m("br"), "", m("br"), "A description of the copyrighted work or other intellectual property that you claim has been infringed;", m("br"), "A description of where the material that you claim is infringing is located on the Site;", m("br"), "An address, telephone number, and email address where we can contact you and, if different, an email address where the alleged infringing party, if not WonderfulSubs LLC, can contact you;", m("br"), "A statement that you have a good-faith belief that the use is not authorized by the copyright owner or other intellectual property rights owner, by its agent, or by law;", m("br"), "A statement by you under penalty of perjury that the information in your notice is accurate and that you are the copyright or intellectual property owner or are authorized to act on the owner's behalf;", m("br"), "Your electronic or physical signature.", m("br"), "WonderfulSubs LLC may request additional information before removing any allegedly infringing material. In the event WonderfulSubs LLC removes the allegedly infringing materials, WonderfulSubs LLC will immediately notify the person responsible for posting such materials that WonderfulSubs LLC removed or disabled access to the materials. WonderfulSubs LLC may also provide the responsible person with your email address so that the person may respond to your allegations.", m("br"), "", m("br"), "Pursuant to 17 U.S.C. 512(c). WonderfulSubs LLC designated Copyright Agent is:", m("br"), "", m("br"), "Legal Department", m("br"), "WonderfulSubs LLC", m("br"), "Five Greentree Centre", m("br"), "525 Route 73 North, STE 104", m("br"), "Marlton,  NJ  08053", m("br"), "Phone: 1 (856) 334-0286", m("br"), "Email: legal@wonderfulsubs.com")
                    ]),
                ])
            ),
            m('style', '@media only screen and (max-width:998px){.content-wrapper-container.flex{overflow:hidden}}')
        ]);
    }
};