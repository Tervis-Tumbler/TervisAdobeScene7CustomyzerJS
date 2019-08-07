import {
    New_AdobeScene7SizeStanza
} from '@tervis/adobescene7js'

import {
    New_TervisAdobeScene7URL,
    New_TervisAdobeScene7ArcedImageURL,
    New_TervisAdobeScene7WrapDecoration3TimesURL,
    New_TervisAdobeScene7ProductVignetteImageURL,
    New_TervisAdobeScene7VirtualImageURL
} from '@tervis/tervisadobescene7js'

import {
    Get_TervisProductImageTemplateName,
    Get_TervisProductMetaDataUsingIndex
} from '@tervis/tervisproductmetadata'

export function New_TervisAdobeScene7CustomyzerArtboardImageURL ({
    $ProjectID,
    $Width,
    $Height,
    $AsScene7SrcValue
}) {
    var $SizeStanza = New_AdobeScene7SizeStanza({$Width, $Height})
    var $RelativeURL = `
        tervis/prj-${$ProjectID}
        ${$SizeStanza ? `?${$SizeStanza}` : ""}
    `.replace(/\s/g, "")

    return New_TervisAdobeScene7URL({$Type: "ImageServer", $RelativeURL, $AsScene7SrcValue})
}

export async function New_TervisAdobeScene7CustomyzerVuMarkImageURL ({
    $ProjectID,
    $VuMarkID
}) {
    return `http://images.tervis.com/is/image/tervis/vum-${$ProjectID}-${$VuMarkID}?scl=1&fmt=png-alpha,rgb`
}

export async function New_TervisAdobeScene7CustomyzerColorInkImageURL ({
    $ProjectID,
    $Size,
    $FormType
}) {
    if ($FormType !== "SS") {
        var $ArtboardImageURLAsSrcValue = New_TervisAdobeScene7CustomyzerArtboardImageURL({$ProjectID, $AsScene7SrcValue: true})
        return New_TervisAdobeScene7ArcedImageURL({$Size, $FormType, $DecalSourceValue: $ArtboardImageURLAsSrcValue})
    } else if ($FormType === "SS") {
        return New_TervisAdobeScene7CustomyzerArtboardImageURL({$ProjectID})
    }
}

export async function New_TervisAdobeScene7CustomyzerWhitInkImageURL ({
    $ProjectID,
    $Size,
    $FormType,
    $WhiteInkColorHex = "00A99C",
    $VuMarkID
}) {
    let $GetTemplateNameParameters = ({$Size, $FormType})
    if (!$VuMarkID && $FormType !== "SS") {
        return `
http://images.tervis.com/is/image/tervis?
src=(
    http://images.tervis.com/is/image/tervisRender/${await Get_TervisProductImageTemplateName({ ...$GetTemplateNameParameters, $TemplateType: "Mask"})}?
    &layer=1
    &mask=is(
        tervisRender?
        &src=ir(
            tervisRender/${await Get_TervisProductImageTemplateName({ ...$GetTemplateNameParameters, $TemplateType: "Vignette"})}?
            &obj=group
            &decal
            &src=is(
                tervisRender/${await Get_TervisProductImageTemplateName({ ...$GetTemplateNameParameters, $TemplateType: "Base"})}?
                .BG
                &layer=5
                &anchor=0,0
                &src=is(
                    tervis/prj-${$ProjectID}
                )
            )
            &show
            &res=300
            &req=object
            &fmt=png-alpha
        )
    )
    &scl=1
)
&scl=1
&color=000000
&fmt=png,gray
&quantize=adaptive,off,2,ffffff,${$WhiteInkColorHex}
`.replace(/\s/g, "")
    } else if ($VuMarkID && $FormType !== "SS") {
        return `
http://images.tervis.com/is/image/tervis?
src=(
    http://images.tervis.com/is/image/tervisRender/16oz_mark_mask?
    &layer=1
    &mask=is(
        tervisRender?
        &src=ir(
            tervisRender/16_Warp_trans?
            &obj=group
            &decal
            &src=is(
                tervisRender/16oz_base2?
                .BG
                &layer=5
                &anchor=0,0
                &src=is(
                    tervis/prj-${$ProjectID}
                )
            )
            &show
            &res=300
            &req=object
            &fmt=png-alpha
        )
    )
    &scl=1
    &layer=2
    &src=is(
        tervisRender/mark_mask_v1?
        &layer=1
        &mask=is(
            tervis/vum-${$ProjectID}-${$VuMarkID}
        )
        &scl=1
    )
    &scl=1
)
&scl=1
&fmt=png,gray
&quantize=adaptive,off,2,ffffff,${$WhiteInkColorHex}
`.replace(/\s/g, "")
    } else if (!$VuMarkID && $FormType === "SS") {
        return `
http://images.tervis.com/is/image/tervis?
src=(
    http://images.tervis.com/is/image/tervisRender/${await Get_TervisProductImageTemplateName({ ...$GetTemplateNameParameters, $TemplateType: "Mask"})}?
    &layer=1
    &mask=is(
        tervisRender/${await Get_TervisProductImageTemplateName({ ...$GetTemplateNameParameters, $TemplateType: "Base"})}?
        .BG
        &layer=5
        &anchor=0,0
        &src=is(
            tervis/prj-${$ProjectID}
        )
    )
    &scl=1
)
&op_grow=1
&op_usm=5,250,255,0
&scl=1
&cache=off
&fmt=png,gray
`.replace(/\s/g, "")
    }
}

export async function New_TervisAdobeScene7CustomyzerVirtualImageURL ({
    $ProjectID,
    $Size,
    $FormType,
    $ProductVignetteDecorationPositionXValue,
    $AsScene7SrcValue
}) {
    var $SizeAndFormTypeMetaData = await Get_TervisProductMetaDataUsingIndex({$Size, $FormType})
    var $DecorationProofImageURLAsSourceValue
    
    var $ProductVignetteImageURLAsSourceValue

    if (!$DecorationProofImageURLAsSourceValue) {
        var $DecorationProofWidthOnVirtual = $SizeAndFormTypeMetaData.DecorationProofWidthOnVirtual    
        var $DecorationProofAspectRatio = $SizeAndFormTypeMetaData.PrintImageDimensions.Width / $SizeAndFormTypeMetaData.PrintImageDimensions.Height
        var $DecorationProofHeightOnVirtual = Math.round($DecorationProofWidthOnVirtual / $DecorationProofAspectRatio)
        
        if ($FormType !== "SS") {

            // await New_TervisAdobeScene7ProofImageURL ({
            //     $DecorationImageURLAsSourceValue: ,
            //     $Size,
            //     $FormType,
            //     $Width: $DecorationProofWidthOnVirtual,
            //     $Height: $DecorationProofHeightOnVirtual,
            //     $AsScene7SrcValue: true,
            //     $IncludeDiecutterCalibrationLine: true
            // })
            
            // New_TervisAdobeScene7DecorationProofImageURL
            $DecorationProofImageURLAsSourceValue = await New_TervisAdobeScene7ArcedProofImageURL({
                $ProjectID,
                $Size,
                $FormType,
                $Width: $DecorationProofWidthOnVirtual,
                $Height: $DecorationProofHeightOnVirtual,
                $AsScene7SrcValue: true,
                $IncludeDiecutterCalibrationLine: true
            })
        } else {
            $DecorationProofImageURLAsSourceValue = New_TervisAdobeScene7CustomyzerArtboardProofImageURL({
                $ProjectID,
                $Width: $DecorationProofWidthOnVirtual,
                $Height: $DecorationProofHeightOnVirtual,
                $AsScene7SrcValue: true
            })
        }
    }

    var $ProductVignetteImageWidth = 1079
    var $ProductVignetteImageHeight = 949
    $ProductVignetteImageURLAsSourceValue = await New_TervisAdobeScene7CustomyzerProjectProductVignetteImageURL({
        $ProjectID,
        $Size,
        $FormType,
        $DecorationPositionXValue: $ProductVignetteDecorationPositionXValue,
        $Width: $ProductVignetteImageWidth,
        $Height: $ProductVignetteImageHeight,
        $AsScene7SrcValue: true
    })

    return await New_TervisAdobeScene7VirtualImageURL({
        $Size,
        $FormType,
        $DecorationProofImageURLAsSourceValue,
        $ProductVignetteImageURLAsSourceValue,
        // $ProductVignetteDecorationPositionXValue,
        $AsScene7SrcValue
    })
}

export async function New_TervisAdobeScene7CustomyzerProjectProductVignetteImageURL ({
    $ProjectID,
    $Size,
    $FormType,
    $DecorationPositionXValue,
    $Width,
    $Height,
    $AsScene7SrcValue
}) {

    var $ElementPathsToShow = [
        "MAIN/GLARE"
    ]
    var $DecorationType
    if ($FormType === "SS") {
        $ElementPathsToShow.push(`MAIN/OUTER/SMOOTH/SS1`)
        $ElementPathsToShow.push(`MAIN/INNER/SMOOTH/SS1`)
        $DecorationType = "DPT"
    } else {
        if ($FormType !== "WAV") {
            $ElementPathsToShow.push(`MAIN/OUTER/SMOOTH/CL1`)
        } else {
            $ElementPathsToShow.push(`MAIN/OUTER/WAVY/CL1`)
        }
        $ElementPathsToShow.push(`MAIN/INNER/LINED/CL1`)
        $DecorationType = "WRA"
    }

    if ($FormType === "SIP") {
        $ElementPathsToShow.push(`MAIN/ACCESSORIES/LIDSIP/GY3`)
    } 
    
    if (($FormType === "SS" && $Size === 24) || ($FormType === "WB")) {
        $ElementPathsToShow.push(`MAIN/ACCESSORIES/LIDWB/GY1`)
    }

    var $ArtobardImageURL = New_TervisAdobeScene7CustomyzerArtboardImageURL({$ProjectID})
    var $RepeatedImageSource = New_TervisAdobeScene7URL({$AsScene7SrcValue: true, $ExternalURL: $ArtobardImageURL})
    
    var $DecorationSrc = New_TervisAdobeScene7WrapDecoration3TimesURL({
        $Size,
        $FormType,
        $AsScene7SrcValue: true,
        $DecorationType,
        $RepeatedImageSource
      })

    var $ProductVignetteImageURL = New_TervisAdobeScene7ProductVignetteImageURL({
        $Size,
        $FormType,
        $VignetteSuffix: 1,
        $DecorationType,
        $DecorationSrc,
        $DecorationPositionXValue,
        $ElementPathsToShow,
        $Width,
        $Height,
        $AsScene7SrcValue
    })

    return $ProductVignetteImageURL
}