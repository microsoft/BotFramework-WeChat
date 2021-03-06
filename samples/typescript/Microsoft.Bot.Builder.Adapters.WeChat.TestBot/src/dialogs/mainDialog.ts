// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AttachmentLayoutTypes, CardFactory } from 'botbuilder';
import { ChoicePrompt, ComponentDialog, DialogSet, DialogTurnStatus, WaterfallDialog } from 'botbuilder-dialogs';
import { ResponseMessageTypes } from 'botframework-wechat';
import * as AdaptiveCard from '../resources/adaptiveCard.json';
import * as MessageMenu from '../resources/MessageMenu.json';

const MAIN_WATERFALL_DIALOG = 'mainWaterfallDialog';

export class MainDialog extends ComponentDialog {
    constructor() {
        super('MainDialog');

        // Define the main dialog and its related components.
        this.addDialog(new ChoicePrompt('cardPrompt'));
        this.addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
            this.choiceCardStep.bind(this),
            this.showCardStep.bind(this)
        ]));

        // The initial child Dialog to run.
        this.initialDialogId = MAIN_WATERFALL_DIALOG;
    }

    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    /**
     * 1. Prompts the user if the user is not in the middle of a dialog.
     * 2. Re-prompts the user when an invalid input is received.
     *
     * @param {WaterfallStepContext} stepContext
     */
    async choiceCardStep(stepContext) {
        console.log('MainDialog.choiceCardStep');

        // Create the PromptOptions which contain the prompt and re-prompt messages.
        // PromptOptions also contains the list of choices available to the user.
        const options = {
            prompt: 'What card would you like to see? You can click or type the card name',
            retryPrompt: 'That was not a valid choice, please select a card or number from 1 to 7.',
            choices: this.getChoices()
        };

        // Prompt the user with the configured PromptOptions.
        return await stepContext.prompt('cardPrompt', options);
    }

    /**
     * Send a Rich Card response to the user based on their choice.
     * This method is only called when a valid prompt response is parsed from the user's response to the ChoicePrompt.
     * @param {WaterfallStepContext} stepContext
     */
    async showCardStep(stepContext) {
        console.log('MainDialog.showCardStep');

        switch (stepContext.result.value) {
        case 'Adaptive Card':
            await stepContext.context.sendActivity({ attachments: [this.createAdaptiveCard()] });
            break;
        case 'Animation Card':
            await stepContext.context.sendActivity({ attachments: [this.createAnimationCard()] });
            break;
        case 'Audio Card':
            await stepContext.context.sendActivity({ attachments: [this.createAudioCard()] });
            break;
        case 'Hero Card':
            await stepContext.context.sendActivity({ attachments: [this.createHeroCard()] });
            break;
        case 'Receipt Card':
            await stepContext.context.sendActivity({ attachments: [this.createReceiptCard()] });
            break;
        case 'Signin Card':
            await stepContext.context.sendActivity({ attachments: [this.createSignInCard()] });
            break;
        case 'Thumbnail Card':
            await stepContext.context.sendActivity({ attachments: [this.createThumbnailCard()] });
            break;
        case 'Video Card':
            await stepContext.context.sendActivity({ attachments: [this.createVideoCard()] });
            break;
        case 'MessageMenu':
            const channelData = {
                    touser: stepContext.context.activity.from.id,
                    msgtype: ResponseMessageTypes.MessageMenu,
                    msgmenu: MessageMenu
                    };
            await stepContext.context.sendActivity({ channelData });
            break;
        default:
            await stepContext.context.sendActivity({
                attachments: [
                    this.createAdaptiveCard(),
                    this.createAnimationCard(),
                    this.createAudioCard(),
                    this.createHeroCard(),
                    this.createReceiptCard(),
                    this.createSignInCard(),
                    this.createThumbnailCard(),
                    this.createVideoCard()
                ],
                attachmentLayout: AttachmentLayoutTypes.Carousel
            });
            break;
        }

        // Give the user instructions about what to do next
        await stepContext.context.sendActivity('Type anything to see another card.');

        return await stepContext.endDialog();
    }

    /**
     * Create the choices with synonyms to render for the user during the ChoicePrompt.
     * (Indexes and upper/lower-case variants do not need to be added as synonyms)
     */
    getChoices() {
        const cardOptions = [
            /* {
                value: 'Adaptive Card',
                synonyms: ['adaptive']
            }, */
            {
                value: 'Animation Card',
                synonyms: ['animation']
            },
            {
                value: 'Audio Card',
                synonyms: ['audio']
            },
            {
                value: 'Hero Card',
                synonyms: ['hero']
            },
            {
                value: 'Receipt Card',
                synonyms: ['receipt']
            },
            {
                value: 'Signin Card',
                synonyms: ['signin']
            },
            {
                value: 'Thumbnail Card',
                synonyms: ['thumbnail', 'thumb']
            },
            {
                value: 'Video Card',
                synonyms: ['video']
            },
            /* {
                value: 'All Cards',
                synonyms: ['all']
            } */
            {
                value: 'MessageMenu',
                synonyms: ['messagemenu']
            }
        ];

        return cardOptions;
    }

    // ======================================
    // Helper functions used to create cards.
    // ======================================

    createAdaptiveCard() {
        return CardFactory.adaptiveCard(AdaptiveCard);
    }

    createAnimationCard() {
        return CardFactory.animationCard(
            'Microsoft Bot Framework',
            [
                { url: 'http://i.giphy.com/Ki55RUbOV5njy.gif' }
            ],
            [],
            {
                subtitle: 'Animation Card'
            }
        );
    }

    createAudioCard() {
        return CardFactory.audioCard(
            'Haydn_Cello_Concerto_D-1',
            ['http://www.hochmuth.com/mp3/Haydn_Cello_Concerto_D-1.mp3'],
            CardFactory.actions([
                {
                    type: 'openUrl',
                    title: 'Read more',
                    value: 'https://en.wikipedia.org/wiki/Cello_Concerto_No._2_(Haydn)'
                }
            ]),
            {
                subtitle: 'Cello Concerto No. 2',
                text: 'In the first movement of the D Major Concerto, the tone is leisurely and soothing. However, the piece soon enters the development phase, where another theme, building upon the opening theme, is discovered. Finally, the recapitulation returns to the main theme.',
                image: { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Gnome-mime-sound-openclipart.svg/50px-Gnome-mime-sound-openclipart.svg.png', alt: 'testimage' }
            }
        );
    }

    createHeroCard() {
        return CardFactory.heroCard(
            'BotFramework Hero Card',
            CardFactory.images(['https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg']),
            CardFactory.actions([
                {
                    type: 'openUrl',
                    title: 'Get started',
                    value: 'https://docs.microsoft.com/en-us/azure/bot-service/'
                }
            ]),
            {
                subtitle: 'Microsoft Bot Framework',
                text: 'Build and connect intelligent bots to interact with your users naturally wherever they are,' +
                       ' from text/sms to Skype, Slack, Office 365 mail and other popular services.'
            }
        );
    }

    createReceiptCard() {
        return CardFactory.receiptCard({
            title: 'John Doe',
            facts: [
                {
                    key: 'Order Number',
                    value: '1234'
                },
                {
                    key: 'Payment Method',
                    value: 'VISA 5555-****'
                }
            ],
            items: [
                {
                    title: 'Data Transfer',
                    subtitle: '',
                    tap: null,
                    text: undefined,
                    price: '$38.45',
                    quantity: '368',
                    image: { url: 'https://github.com/amido/azure-vector-icons/raw/master/renders/traffic-manager.png' }
                },
                {
                    title: 'App Service',
                    price: '$45.00',
                    subtitle: '',
                    tap: null,
                    text: undefined,
                    quantity: '720',
                    image: { url: 'https://github.com/amido/azure-vector-icons/raw/master/renders/cloud-service.png' }
                }
            ],
            tax: '$7.50',
            total: '$90.95',
            buttons: CardFactory.actions([
                {
                    type: 'openUrl',
                    title: 'More information',
                    value: 'https://azure.microsoft.com/en-us/pricing/details/bot-service/'
                }
            ]),
            tap: null,
            vat: null
        });
    }

    createSignInCard() {
        return CardFactory.signinCard(
            'Sign in',
            'https://login.microsoftonline.com',
            'BotFramework Sign in Card'
        );
    }

    createThumbnailCard() {
        return CardFactory.thumbnailCard(
            'BotFramework Thumbnail Card',
            [{ url: 'https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg' }],
            [{
                type: 'openUrl',
                title: 'Get started',
                value: 'https://docs.microsoft.com/en-us/azure/bot-service/'
            }],
            {
                subtitle: 'Your bots — wherever your users are talking.',
                text: 'Build and connect intelligent bots to interact with your users naturally wherever they are, from text/sms to Skype, Slack, Office 365 mail and other popular services.'
            }
        );
    }

    createVideoCard() {
        return CardFactory.videoCard(
            '2018 Imagine Cup World Championship Intro',
            [{ url: 'https://sec.ch9.ms/ch9/783d/d57287a5-185f-4df9-aa08-fcab699a783d/IC18WorldChampionshipIntro2.mp4' }],
            [{
                type: 'openUrl',
                title: 'Lean More',
                value: 'https://channel9.msdn.com/Events/Imagine-Cup/World-Finals-2018/2018-Imagine-Cup-World-Championship-Intro'
            }],
            {
                subtitle: 'by Microsoft',
                text: 'Microsoft\'s Imagine Cup has empowered student developers around the world to create and innovate on the world stage for the past 16 years. These innovations will shape how we live, work and play.'
            }
        );
    }
}

module.exports.MainDialog = MainDialog;
