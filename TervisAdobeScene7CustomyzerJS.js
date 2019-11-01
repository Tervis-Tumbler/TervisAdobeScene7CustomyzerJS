import {
    New_AdobeScene7SizeStanza
} from '@tervis/adobescene7js'

import {
    New_TervisAdobeScene7URL,
    New_TervisAdobeScene7ArcedImageURL,
    New_TervisAdobeScene7WrapDecoration3TimesURL,
    New_TervisAdobeScene7ProductVignetteImageURL,
    New_TervisAdobeScene7VirtualImageURL,
    New_TervisAdobeScene7DecorationProofImageURL
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
    $VuMarkID,
    $Width,
    $Height,
    $AsScene7SrcValue
}) {
    var $SizeStanza = New_AdobeScene7SizeStanza({$Width, $Height})
    var $RelativeURL = `
        tervis/vum-${$ProjectID}-${$VuMarkID}
        ${$SizeStanza ? `?${$SizeStanza}` : ""}
    `.replace(/\s/g, "")
    
    return New_TervisAdobeScene7URL({$Type: "ImageServer", $RelativeURL, $AsScene7SrcValue})
}

export async function New_TervisAdobeScene7CustomyzerColorInkImageURL ({
    $ProjectID,
    $ProductSize,
    $ProductFormType,
    $VuMarkID,
    $AsScene7SrcValue
}) {
    return New_TervisAdobeScene7CustomyzerDecorationImageURL({$ProjectID, $ProductSize, $ProductFormType, $AsScene7SrcValue, $VuMarkID})
}

export async function New_TervisAdobeScene7CustomyzerDecorationImageURL ({
    $ProjectID,
    $ProductSize,
    $ProductFormType,
    $VuMarkID,
    $Width,
    $Height,
    $AsScene7SrcValue
}) {
    if ($ProductFormType !== "SS") {
        var $ArtboardImageURLAsSrcValue = New_TervisAdobeScene7CustomyzerArtboardImageURL({$ProjectID, $AsScene7SrcValue: true})
        if (!$VuMarkID) {
            return await New_TervisAdobeScene7ArcedImageURL({
                $ProductSize,
                $ProductFormType,
                $Width,
                $Height,
                $DecalSourceValue: $ArtboardImageURLAsSrcValue,
                $AsScene7SrcValue
            })
        } else {
            var $ArcedImageURLAsSrcValue = await New_TervisAdobeScene7ArcedImageURL({
                $ProductSize,
                $ProductFormType,
                $Width,
                $Height,
                $DecalSourceValue: $ArtboardImageURLAsSrcValue,
                $AsScene7SrcValue: true
            })

            var $VuMarkImageURLAsSrcValue = await New_TervisAdobeScene7CustomyzerVuMarkImageURL({
                $ProjectID,
                $VuMarkID,
                $Width: 150,
                $Height: 173,
                $AsScene7SrcValue: true
            })

            var $ProductMetaData = await Get_TervisProductMetaDataUsingIndex({$ProductSize, $ProductFormType})

            $RelativeURL = `
                tervis?
                &layer=0
                &src=${$ArcedImageURLAsSrcValue}
                &layer=1
                &src=${$VuMarkImageURLAsSrcValue}
                &pos=${$ProductMetaData.VuMarkScene7PositionRelativeToPrintImageDeminsionsCenterPoint.X},${$ProductMetaData.VuMarkScene7PositionRelativeToPrintImageDeminsionsCenterPoint.Y}
            `.replace(/\s/g, "")

            return New_TervisAdobeScene7URL({$Type: "ImageServer", $RelativeURL, $AsScene7SrcValue})
        }
    } else if ($ProductFormType === "SS") {
        return New_TervisAdobeScene7CustomyzerArtboardImageURL({$ProjectID, $AsScene7SrcValue})
    }
}

export async function New_TervisAdobeScene7CustomyzerWhiteInkImageURL ({
    $ProjectID,
    $ProductSize,
    $ProductFormType,
    $WhiteInkColorHex = "00A99C",
    $VuMarkID
}) {
    let $GetTemplateNameParameters = ({$ProductSize, $ProductFormType})
    if (!$VuMarkID && $ProductFormType !== "SS") {
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
    } else if ($VuMarkID && $ProductFormType !== "SS") {
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
    } else if (!$VuMarkID && $ProductFormType === "SS") {
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
    $ProductSize,
    $ProductFormType,
    $ProductVignetteDecorationPositionXValue,
    $AsScene7SrcValue
}) {
    var $SizeAndFormTypeMetaData = await Get_TervisProductMetaDataUsingIndex({$ProductSize, $ProductFormType})
    
    var $DecorationProofWidthOnVirtual = $SizeAndFormTypeMetaData.DecorationProofWidthOnVirtual    
    var $DecorationProofAspectRatio = $SizeAndFormTypeMetaData.PrintImageDimensions.Width / $SizeAndFormTypeMetaData.PrintImageDimensions.Height
    var $DecorationProofHeightOnVirtual = Math.round($DecorationProofWidthOnVirtual / $DecorationProofAspectRatio)
    
    var $DecorationImageURLAsSourceValue = await New_TervisAdobeScene7CustomyzerDecorationImageURL({
        $ProductSize,
        $ProductFormType,
        $ProjectID,
        $Width: $DecorationProofWidthOnVirtual,
        $Height: $DecorationProofHeightOnVirtual,
        $AsScene7SrcValue: true
    })

    var $ArcedDecorationAndIncludeDieCutterCalibrationLine
    if ($ProductFormType !== "SS") {
        $ArcedDecorationAndIncludeDieCutterCalibrationLine = true
    } else {
        $ArcedDecorationAndIncludeDieCutterCalibrationLine = false
    }

    var $DecorationProofImageURLAsSourceValue = await New_TervisAdobeScene7DecorationProofImageURL({
        $DecorationImageURLAsSourceValue,
        $ArcedDecoration: $ArcedDecorationAndIncludeDieCutterCalibrationLine,
        $ProductSize,
        $ProductFormType,
        $IncludeDiecutterCalibrationLine: $ArcedDecorationAndIncludeDieCutterCalibrationLine,
        $Width: $DecorationProofWidthOnVirtual,
        $Height: $DecorationProofHeightOnVirtual,
        $AsScene7SrcValue: true
    })

    var $ProductVignetteImageWidthOnVirtual = 1079
    var $ProductVignetteImageHeightOnVirtual = 949
    var $ProductVignetteImageURLAsSourceValue = await New_TervisAdobeScene7CustomyzerProjectProductVignetteImageURL({
        $ProjectID,
        $ProductSize,
        $ProductFormType,
        $DecorationPositionXValue: $ProductVignetteDecorationPositionXValue,
        $Width: $ProductVignetteImageWidthOnVirtual,
        $Height: $ProductVignetteImageHeightOnVirtual,
        $AsScene7SrcValue: true
    })

    return await New_TervisAdobeScene7VirtualImageURL({
        $ProductSize,
        $ProductFormType,
        $DecorationProofImageURLAsSourceValue,
        $ProductVignetteImageURLAsSourceValue,
        // $ProductVignetteDecorationPositionXValue,
        $AsScene7SrcValue
    })
}

export async function New_TervisAdobeScene7CustomyzerProjectProductVignetteImageURL ({
    $ProjectID,
    $ProductSize,
    $ProductFormType,
    $DecorationPositionXValue,
    $Width,
    $Height,
    $AsScene7SrcValue
}) {

    var $ElementPathsToShow = [
        "MAIN/GLARE"
    ]
    var $DecorationType
    if ($ProductFormType === "SS") {
        $ElementPathsToShow.push(`MAIN/OUTER/SMOOTH/SS1`)
        $ElementPathsToShow.push(`MAIN/INNER/SMOOTH/SS1`)
        $DecorationType = "DPT"
    } else {
        if ($ProductFormType !== "WAV") {
            $ElementPathsToShow.push(`MAIN/OUTER/SMOOTH/CL1`)
        } else {
            $ElementPathsToShow.push(`MAIN/OUTER/WAVY/CL1`)
        }
        $ElementPathsToShow.push(`MAIN/INNER/LINED/CL1`)
        $DecorationType = "WRA"
    }

    if ($ProductFormType === "SIP") {
        $ElementPathsToShow.push(`MAIN/ACCESSORIES/LIDSIP/GY3`)
    } 
    
    if (($ProductFormType === "SS" && $ProductSize === 24) || ($ProductFormType === "WB")) {
        $ElementPathsToShow.push(`MAIN/ACCESSORIES/LIDWB/GY1`)
    }

    var $ArtobardImageURL = New_TervisAdobeScene7CustomyzerArtboardImageURL({$ProjectID})
    var $RepeatedImageSource = New_TervisAdobeScene7URL({$AsScene7SrcValue: true, $ExternalURL: $ArtobardImageURL})
    
    var $DecorationSrc = New_TervisAdobeScene7WrapDecoration3TimesURL({
        $ProductSize,
        $ProductFormType,
        $AsScene7SrcValue: true,
        $DecorationType,
        $RepeatedImageSource
      })

    var $ProductVignetteImageURL = New_TervisAdobeScene7ProductVignetteImageURL({
        $ProductSize,
        $ProductFormType,
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