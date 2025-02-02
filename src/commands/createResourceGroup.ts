/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IActionContext } from '@microsoft/vscode-azext-utils';
import { window } from 'vscode';
import { ext } from '../extensionVariables';
import { ResourceGroupTreeItem } from '../tree/ResourceGroupTreeItem';
import { SubscriptionTreeItem } from '../tree/SubscriptionTreeItem';
import { localize } from '../utils/localize';

export async function createResourceGroup(context: IActionContext, node?: SubscriptionTreeItem): Promise<void> {
    if (!node) {
        node = await ext.appResourceTree.showTreeItemPicker<SubscriptionTreeItem>(SubscriptionTreeItem.contextValue, context);
    }

    const rgNode: ResourceGroupTreeItem = await node.createChild(context);

    void window.showInformationMessage(localize('createdRg', 'Created resource group "{0}".', rgNode.name));
}
